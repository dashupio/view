
// import dependencies
import dotProp from 'dot-prop';
import React, { useState, useEffect } from 'react';

// view cache
const viewCache = {};
const loadCache = {};
const requCache = {};

// loop require
// do this to allow individual modules to work without requiring their dependencies
try {
  requCache.react = require('react');
} catch (e) {}
try {
  requCache.moment = require('moment');
} catch (e) {}
try {
  requCache.handlebars = require('handlebars');
} catch (e) {}
try {
  requCache['pretty-ms'] = require('pretty-ms');
} catch (e) {}
try {
  requCache['react-dom'] = require('react-dom');
} catch (e) {}
try {
  requCache['@dashup/ui'] = require('@dashup/ui');
} catch (e) {}
try {
  requCache['react-select'] = require('react-select');
} catch (e) {}
try {
  requCache['react-bootstrap'] = require('react-bootstrap');
} catch (e) {}
try {
  requCache['react-sortablejs'] = require('react-sortablejs');
} catch (e) {}
try {
  requCache['react-select/async'] = require('react-select/async');
} catch (e) {}
try {
  requCache['handlebars-helpers'] = require('handlebars-helpers');
} catch (e) {}
try {
  requCache['react-perfect-scrollbar'] = require('react-perfect-scrollbar');
} catch (e) {}

// require all
Object.keys(requCache).forEach((key) => {
  // try/catch require
  try {
    requCache[key] = require(key);
  } catch (e) {}
});

// create menu component
const DashupView = (props = {}) => {
  // get type/view/struct
  const { type, view, struct, dashup } = props;

  // set loading
  const [loading, setLoading] = useState(!(!view || !type || !struct || !dashup));
  
  // tld
  const item = `${type}.${struct}.${view}`.split('/').join('-');

  // check has view
  useEffect(() => {
    // use effect
    if (!dotProp.get(viewCache, item)) {
      // set loading
      setLoading(true);

      // try loading
      if (dotProp.get(loadCache, item)) {
        // await loaded from another module
        dotProp.get(loadCache, item).then(() => setLoading(false));
      } else {
        // create load cache item
        dotProp.set(loadCache, item, new Promise((resolve) => {
          // load
          props.dashup.rpc({
            type,
            struct,
          }, 'views', [view]).then((data) => {
            // check not found
            if (!data || !data[0]) {
              resolve(null);
              setLoading(false);
              return console.log(`[dashup] view ${type}:${struct} ${view} not found`);
            }

            // try/catch
            try {
              // expand data
              const [{ code, uuid }] = data;
      
              // create global
              const shimGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : null;
      
              // check window
              if (!shimGlobal.shimRequire) {
                // create shim require function
                shimGlobal.shimRequire = (name) => {
                  // names
                  if (requCache[name]) return requCache[name];
                };
              }
      
              // create new function
              try {
                // try/catch
                new Function(`const require = ${typeof window === 'undefined' ? 'global' : 'window'}.shimRequire; ${code}`)();
              } catch (e) {
                console.error(`[dashup] view ${type}:${struct} ${view}`, e);
              }
      
              // set code
              const actualView = shimGlobal[uuid] && shimGlobal[uuid].default || shimGlobal[uuid];
      
              // set to cache
              dotProp.set(viewCache, item, actualView);
      
              // finish loading
              resolve(actualView);
              setLoading(false);
            } catch (e) {
              // error
              console.error(`[dashup] view ${type}:${struct} ${view}`, e);
            }
          });
        }));
      } 
    }
  }, [struct, type, view]);

  // get component
  const Component = dotProp.get(viewCache, item);

  // on load
  if (Component && !loading && props.onLoad) setTimeout(props.onLoad, 100);
      
  // create new function
  try {
    // return JSX
    return Component ? <Component { ...props } /> : (props.children || <div></div>);
  } catch (e) {
    // error
    console.error(`[dashup] view ${type}:${struct} ${view}`, e);
  }
};

// export default
export default DashupView;
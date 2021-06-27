
// import dependencies
import dotProp from 'dot-prop';
import React, { useState, useEffect } from 'react';


// view cache
const viewCache = {};
const loadCache = {};
const requCache = {
  react : React,
};

// create menu component
const DashupUIView = (props = {}) => {
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

// set defaults
DashupUIView.setDefaults = (def) => {
  // loop
  Object.keys(def).map((key) => {
    requCache[key] = def[key];
  });
};

// export default
export default DashupUIView;

// import dependencies
import dotProp from 'dot-prop';
import { EventEmitter } from 'events';
import { ErrorBoundary } from 'react-error-boundary';
import React, { useState, useEffect } from 'react';

// view cache
const viewCache = {};
const loadCache = {};
const requCache = {
  react : React,
};
const viewEvents = new EventEmitter();

// create menu component
const DashupUIView = (props = {}) => {
  // get type/view/struct
  const { type, view, struct, dashup } = props;
  
  // tld
  const item = `${type}.${struct}.${view}`.split('/').join('-');

  // set loading
  const [loaded, setLoaded] = useState(!!dotProp.get(viewCache, item));
  const [loading, setLoading] = useState(!(!view || !type || !struct || !dashup));

  // load view
  const loadView = (attempt = 0) => {
    // reattempt
    const reAttempt = () => {
      // reattempt
      if (attempt < 5) {
        // create load cache item
        setTimeout(() => {
          // set
          dotProp.set(loadCache, item, loadView(attempt + 1));

          // set events
          viewEvents.emit(item, true);
        }, attempt * 2000);
      } 
    };

    // return new promise
    return new Promise(async (resolve, reject) => {
      // finished
      let finished = false;
    
      // data promise
      const dataPromise = props.dashup.rpc({
        type,
        struct,
      }, 'views', [view]);
  
      // timeout promise
      const timeoutPromise = setTimeout(() => {
        // timeout
        finished = true;
  
        // reject
        reject();
        reAttempt();
      }, 5000);

      // try/catch
      try {
        // await
        const data = await dataPromise;

        // check finished
        if (finished) return;
        finished = true;
        clearTimeout(timeoutPromise);

        // check not found
        if (!data || !data[0]) {
          // resolve
          resolve(null);
          reAttempt();

          // log return
          return console.log(`[dashup] view ${type}:${struct} ${view} not found`);
        }

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
          new Function(`const fileName = '${type}:${struct}'; const ${'req'}${'uire'} = ${typeof window === 'undefined' ? 'global' : 'window'}.shimRequire; ${code}`)();
        } catch (e) {
          console.error(`[dashup] view ${type}:${struct} ${view}`, e);
        }

        // set code
        const actualView = shimGlobal[uuid];

        // set to cache
        dotProp.set(viewCache, item, actualView?.default || actualView);
        setLoaded(true);

        // finish loading
        resolve(actualView?.default || actualView);
      } catch (e) {
        reject(e);
        reAttempt();
      }
    });
  };

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

        // retry loader
        const retryLoader = () => {
          // await loaded from another module
          dotProp.get(loadCache, item).then(() => setLoading(false));
        };

        // add listener
        viewEvents.on(item, retryLoader);

        // return
        return () => {
          // off
          viewEvents.removeListener(item, retryLoader);
        };
      } else {
        // create load cache item
        dotProp.set(loadCache, item, loadView());
      } 
    }
  }, [struct, type, view]);

  // get component
  const Component = dotProp.get(viewCache, item);

  // on load
  if (Component && !loading && props.onLoad) setTimeout(props.onLoad, 100);

  // error fallback
  const ErrorFallback = ({ error, resetErrorBoundary }) => {
    // log error
    console.error(`[dashup] view ${type}:${struct} ${view}`, error);

    // return ! div
    return <div />;
  };
      
  // create new function
  try {
    // return JSX
    return Component ? (
      <ErrorBoundary
        FallbackComponent={ ErrorFallback }
        onReset={ () => {
          // reset the state of your app so the error doesn't happen again
        } }
      >
        <Component { ...props } />
      </ErrorBoundary>
    ) : (props.children || <div></div>);
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
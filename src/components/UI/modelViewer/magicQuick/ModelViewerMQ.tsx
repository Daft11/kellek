import React, { useEffect } from "react";

declare function loadModel(id: string):void;

const jq3_4_1ScriptParams = {
  src: "https://code.jquery.com/jquery-3.4.1.min.js",
  integrity: "sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=",
  crossOrigin: "anonymous"
}

const magicQuickModelViewerScriptParams = {
  src: "https://237529.selcdn.ru/Kellek/ModelViewer.js",
}


async function addScript(src: string, integrity?: string, crossOrigin?: string) {
  const script = document.createElement("script"); 

  script.src = src;
  if(integrity) script.integrity = integrity
  if(crossOrigin) script.crossOrigin = crossOrigin
  script.async = true;
  await document.head.appendChild(script);
  return new Promise<void>((resolve, reject) => {
    script.onload = function() {
      resolve();
    }
    script.onerror = function(err) {
      reject(err);
    };
  })
}

const getScript = addScript(jq3_4_1ScriptParams.src, jq3_4_1ScriptParams.integrity, jq3_4_1ScriptParams.crossOrigin)
    .then(() => addScript(magicQuickModelViewerScriptParams.src))

const ModelViewerMagicQuick = ({productId}) => {

  useEffect(() => {
    getScript.then(() => loadModel(productId))
  }, [productId])

  return (
    <iframe id="modelViewerIframe" 
            src=""
            scrolling="no"
            frameBorder="0"
            title="modelViewerIframe"
            style={{height: '100%', width: '100%'}}></iframe>
  )
}

export default ModelViewerMagicQuick;
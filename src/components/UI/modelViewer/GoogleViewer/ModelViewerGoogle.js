import '@google/model-viewer';

const ModelViewerGoogle = (props) => (
  <model-viewer
    src={props.src}
    style={{height: '100%', width: '100%'}}
    ios-src={props.src}
    shadow-intensity="1"
    camera-controls
    auto-rotate
  ></model-viewer>
)

export default ModelViewerGoogle;
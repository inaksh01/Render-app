import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [imgUrl, setImgUrl] = useState(null);
  const [detections, setDetections] = useState([]);
  const [names, setNames] = useState({});

  const upload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUrl(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append('file', file);
    const resp = await axios.post('/api/detect/', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
    setDetections(resp.data.detections);
    setNames(resp.data.names);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>YOLOv8 Object Detector</h1>
      <input type="file" accept="image/*" onChange={upload} />
      {imgUrl && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={imgUrl} alt="" style={{ maxWidth: '100%' }} />
          {detections.map((d,i) => (
            <div key={i} style={{
              position: 'absolute', left: d.x1, top: d.y1,
              width: d.x2 - d.x1, height: d.y2 - d.y1,
              border: '2px solid red', pointerEvents: 'none'
            }}>
              <span style={{
                backgroundColor: 'red', color: 'white', fontSize: 12
              }}>
                {names[d.class_id] || d.class_id} {d.confidence.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

const anatomyStyle=document.createElement('link');
anatomyStyle.rel='stylesheet';
anatomyStyle.href='anatomy.css';
document.head.append(anatomyStyle);

const realScript=document.createElement('script');
realScript.src='realmodel.js';
document.body.append(realScript);

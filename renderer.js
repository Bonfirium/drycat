const renderers = ['ping-pong', 'planets', 'maze', 'three-circles'];

module.exports = `renderers/${renderers[Math.floor(Math.random() * renderers.length)]}/index.html`;

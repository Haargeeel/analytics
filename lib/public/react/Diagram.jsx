var React = require('react')
  , Point = require('../js/Point')
  , Pen = require('../js/Pen');

var Diagram = React.createClass({

  getInitialState: function() {
    var data = [140, 130, 135, 135];
    var index = data.length - 1;
    var oldData = [0, 5, 15, 17, 22, 30, 90, 105, 110, 100, 90, 110, 130, 130, 140];
    var fps = 60;
    var ms = 1000 / fps;
    return {
      height: 400,
      width: 800,
      oldData: oldData,
      data: data,
      pen: {},
      points: [],
      intervalID: null,
      fps: fps,
      ms: ms,
      rate: 10,
      n: 0,
      index: index
    };
  },

  componentDidMount: function() {
    var that = this;
    this.setState({pen: new Pen(this.state.oldData.length)}, function() {
      // draw old data
      this.renderOldGraph();
      // draw current data
      this.renderGraph(0);

      var id = setInterval(this.update, this.state.ms);
      this.setState({intervalID: id});
    });
    window.addEventListener('keydown', function(e) {
      if (e.keyIdentifier === 'Up') {
        var fps = that.state.fps + 5;
        var ms = 1000 / fps;
        console.log('fps', fps)
        that.setState({fps: fps, ms: ms});
      }
      if (e.keyIdentifier === 'Down') {
        var fps = that.state.fps - 5;
        var ms = 1000 / fps;
        console.log('fps', fps)
        that.setState({fps: fps, ms: ms});
      }
      if (e.keyIdentifier === 'Right') {
        var rate = that.state.rate + 1;
        console.log('rate', rate)
        that.setState({rate: rate});
      }
      if (e.keyIdentifier === 'Left') {
        var rate = that.state.rate - 1;
        console.log('rate', rate)
        that.setState({rate: rate});
      }
    });
  },

  update: function() {
    var n = this.state.n + 1;
    var data = this.state.data;
    var index = this.state.index;
    if (n >= this.state.rate) {
      var min = this.state.oldData[index+1] - 10;
      var max = this.state.oldData[index+1] + 10;
      var randomY = Math.abs(Math.floor(Math.random() * (max - min)) + min);
      data.push(randomY);
      index++;
      n = 0;
    }
    this.setState({data: data, index: index, n: n}, function() {
      var canvas = document.getElementById('canvas');
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      this.renderOldGraph();
      this.renderGraph();

      // restart with new data
      if (this.state.data.length === this.state.oldData.length) {
        clearInterval(this.state.intervalID);
        var oldData = this.state.data.slice(0);
        var data = [];
        data[0] = oldData[oldData.length - 1];
        this.setState({
          oldData: oldData,
          data: data,
          points: [],
          index: 0
        }, function() {
          this.renderOldGraph();
          this.renderGraph();
          var id = setInterval(this.update, this.state.ms);
          this.setState({intervalID: id});
        });
      }
    });
  },

  renderOldGraph: function() {
    var points = [];
    for (var i = 0; i <= this.state.oldData.length - 1; i++) {
      points[i] = new Point(i, this.state.oldData[i]);
      if (i !== 0) {
        this.state.pen.drawLine(points[i-1], points[i], 'old');
        this.state.pen.drawIntegral(points[i-1], points[i], 'old');
      }
    }
  },

  renderGraph: function() {
    var points = this.state.points;
    for (var i = 0; i <= this.state.data.length - 1; i++) {
      points[i] = new Point(i, this.state.data[i]);
      if (i !== 0) {
        this.state.pen.drawLine(points[i-1], points[i], 'new');
        this.state.pen.drawIntegral(points[i-1], points[i], 'new');
      }
    }
    this.setState({points: points});
  },

  render: function() {
    return (
      <div className='diagram'>
        <canvas id='canvas'
                width={this.state.width+'px'}
                height={this.state.height+'px'} />
      </div> 
    );
  }
});

module.exports = Diagram;

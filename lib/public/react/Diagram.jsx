var React = require('react')
  , Point = require('../js/Point')
  , Pen = require('../js/Pen');

var Diagram = React.createClass({

  getInitialState: function() {
    var data = [140, 130, 135, 135];
    var index = data.length - 1;
    var oldData = [0, 5, 15, 17, 22, 30, 90, 105, 110, 100, 90, 110, 130, 130, 140];
    var fps = 25;
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
      step: 0,
      mouseCoord: null,
      mousePos: [],
      index: index
    };
  },

  componentDidMount: function() {
    var that = this;
    var canvas = document.getElementById('canvas');
    this.setState({
      step: Math.ceil(canvas.width / (this.state.oldData.length - 1)),
      pen: new Pen()}, function() {
        // draw old data
        this.drawOldGraph();
        // draw current data
        this.drawGraph(0);

        var id = setInterval(this.update, this.state.ms);
        this.setState({intervalID: id});
    });
    canvas.addEventListener('mousemove', function(e) {
      console.log(e);
      var rect = canvas.getBoundingClientRect();
      var p = new Point(e.clientX - rect.left,
                        e.clientY - rect.top + canvas.height);
      that.setState({mouseCoord: p, mousePos: [e.pageX, e.pageY]});
    });
    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 83) { // s
        clearInterval(that.state.intervalID);
      }
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
    var that = this;
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
      this.drawOldGraph();
      this.drawGraph();
      if (this.state.mouseCoord) {
        this.drawCircle();
      }

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
          this.drawOldGraph();
          this.drawGraph();
          var id = setInterval(this.update, this.state.ms);
          this.setState({intervalID: id});
        });
      }
    });
  },

  drawOldGraph: function() {
    var points = [];
    for (var i = 0; i <= this.state.oldData.length - 1; i++) {
      points[i] = new Point(i * this.state.step, this.state.oldData[i]);
      if (i !== 0) {
        this.state.pen.drawLine(points[i-1], points[i], 'old');
        this.state.pen.drawIntegral(points[i-1], points[i], 'old');
      }
    }
  },

  drawGraph: function() {
    var points = this.state.points;
    for (var i = 0; i <= this.state.data.length - 1; i++) {
      points[i] = new Point(i * this.state.step, this.state.data[i]);
      if (i !== 0) {
        this.state.pen.drawLine(points[i-1], points[i], 'new');
        this.state.pen.drawIntegral(points[i-1], points[i], 'new');
      }
    }
    this.setState({points: points});
  },

  drawCircle: function() {
    var that = this;
    var showHint = false;
    this.state.points.forEach(function(point) {
      if ((that.state.mouseCoord.x < point.x + 5 &&
          that.state.mouseCoord.x > point.x - 5) &&
          (that.state.mouseCoord.y < point.y + 5 &&
           that.state.mouseCoord.y > point.y - 5)) {
        that.state.pen.drawCircle(point);
        showHint = true;
      }
    });
    this.setState({showHint: showHint});
  },

  renderHint: function() {
    if (this.state.showHint) {
      var style = {left: this.state.mousePos[0] - 20,
                   top: this.state.mousePos[1] - 30};
      return (
        <div className='hint' style={style}>
        </div>
      );
    }
  },

  render: function() {
    return (
      <div className='diagram'>
        <canvas id='canvas'
                width={this.state.width+'px'}
                height={this.state.height+'px'} />
        { this.renderHint() }
      </div> 
    );
  }
});

module.exports = Diagram;

var React = require('react')

var Diagram = React.createClass({

  getInitialState: function() {
    var data = [140, 130, 135, 135];
    var index = data.length - 1;
    return {
      height: 400,
      width: 800,
      oldData: [0, 5, 15, 17, 22, 30, 90, 105, 110, 100, 90, 110, 130, 130, 140],
      data: data,
      index: index
    };
  },

  componentDidMount: function() {
    var that = this;

    // draw old data
    this.renderOldGraph();

    // draw current data
    this.renderGraph(0);

    var id = setInterval(function() {
      var index = that.state.index;
      var randomY = that.state.data[index] + 10;
      var data = that.state.data;
      data.push(randomY);
      that.setState({data: data, index: index + 1}, function() {
        that.renderGraph(index);
      });
      if (that.state.data.length === that.state.oldData.length)
        clearInterval(id);
    }, 1000);

    //window.addEventListener('resize', function(e) {
      //console.log(e);
      //console.log('resize');
      //clearInterval(id);
      //that.setState({width: window.innerWidth - 200, height: window.innerHeight -200}, function() {
        //that.renderOldGraph();
        //that.renderGraph(0);

        //id = setInterval(function() {
          //var index = that.state.index;
          //var randomY = that.state.data[index] + 10;
          //var data = that.state.data;
          //data.push(randomY);
          //that.setState({data: data, index: index + 1}, function() {
            //that.renderGraph(index);
          //});
          //if (that.state.data.length === that.state.oldData.length)
            //clearInterval(id);
        //}, 1000);
      //});
    //});
  },

  renderOldGraph: function() {
    var that = this;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var step = Math.ceil(this.state.width / (this.state.oldData.length - 1));

    var getY = function(y) {
      return that.state.height - y;
    };

    ctx.beginPath();
    ctx.strokeStyle = '#888';
    ctx.fillStyle = '#888';
    ctx.moveTo(0, getY(this.state.oldData[0]));

    for (var i = 1; i <= this.state.oldData.length - 1; i++) {
      // draw line
      ctx.lineTo(i * step, getY(this.state.oldData[i]));
      ctx.stroke();
      ctx.closePath();
      
      // draw under the line
      ctx.beginPath();
      ctx.globalAlpha = 0.1;
      ctx.moveTo((i-1)*step, getY(this.state.oldData[i-1]));
      ctx.lineTo(i*step, getY(this.state.oldData[i]));
      ctx.lineTo(i*step, this.state.height);
      ctx.lineTo((i-1)*step, this.state.height);
      ctx.fill();
      ctx.closePath();
      
      // prepare for next round
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(i*step, getY(this.state.oldData[i]));
    }
  },

  renderGraph: function(index) {
    var that = this;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var step = Math.ceil(this.state.width / (this.state.oldData.length - 1));

    var getY = function(y) {
      return that.state.height - y;
    };

    ctx.beginPath();
    ctx.moveTo(index * step, getY(this.state.data[index]));

    for (var i = index + 1; i <= this.state.data.length - 1; i++) {

      if (this.state.data[i-1] < this.state.data[i]) {
        ctx.strokeStyle = '#22dd22';
        ctx.fillStyle = '#22dd22';
      } else if (this.state.data[i-1] === this.state.data[i]) {
        ctx.strokeStyle = '#dddd22';
        ctx.fillStyle = '#dddd22';
      } else {
        ctx.strokeStyle = '#dd2222';
        ctx.fillStyle = '#dd2222';
      }

      // draw line
      ctx.lineTo(i * step, getY(this.state.data[i]));
      ctx.stroke();
      ctx.closePath();
      
      // draw under the line
      ctx.beginPath();
      ctx.globalAlpha = 0.1;
      ctx.moveTo((i-1) * step, getY(this.state.data[i-1]));
      ctx.lineTo(i * step, getY(this.state.data[i]));
      ctx.lineTo(i * step, this.state.height);
      ctx.lineTo((i-1) * step, this.state.height);
      ctx.fill();
      ctx.closePath();
      
      // prepare for next round
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(i * step, getY(this.state.data[i]));
    }

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

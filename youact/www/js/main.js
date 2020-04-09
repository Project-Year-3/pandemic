var init = function(){
  mnml = new MNML();

  chart = new Canvas("chart",{
    title:{
      text:"hello world"
    },
    type:"column",
    data: [              
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: [
          { label: "apple",  y: 10  },
          { label: "orange", y: 15  },
          { label: "banana", y: 25  },
          { label: "mango",  y: 30  },
          { label: "grape",  y: 28  }
        ]
      }
      ],
      animationEnabled: true
  });
  chart.render();
  mnml.e.controls.controls.wrapper.addEventListener("mnmlChange",e=>{
    var name = e.detail.name;
    var value = e.detail.value;
    var points = chart.chart.data[0].dataPoints;
    for(var i in points){
      if(points[i].label == name){
        points[i].y = Number(value);
      }
    };
    chart.render();
  },false);

  chart.chart.data[0].dataPoints.forEach(e => {
    mnml.addControl("controls",{
      label:e.label,
      name:e.label,
      type:"range",
      value:e.y,
      min:0,
      max:100
    })
  });
  
}
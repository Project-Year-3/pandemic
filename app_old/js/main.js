var init = function(){
  chart = new Canvas("canvas1",{
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

  gui = new dat.GUI({ autoPlace: false });
  chart.chart.options.data[0].dataPoints.forEach(p => {
    Object.defineProperty(chart,p.label,{
      set:(v)=>{
        p.y = v;
      },
      get:()=>{
        return p.y
      }
    });
    gui.add(chart,p.label,0,100)
  });
  
  document.querySelector(".controls[data-bindTo='canvas1']").appendChild(gui.domElement);

  document.querySelector(".subviews").addEventListener("subviewChange",(e)=>{
    if(e.detail.page == 0){
      chart.render()
    }
  },false);
}
window.onload = startElements().then(init);
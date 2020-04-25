var init = function(){
  pandemicsCourse = new Course({
    name:"Pandemics",
    htmlUrl:"/pandemics_course/pandemics.html",
    jsonUrl:"/pandemics_course/content.json"
  });
  pandemicsCourse.loaded.then(()=>{
    for (key in pandemicsCourse.content) {
      if(pandemicsCourse.content[key].type == "quiz"){
        pandemicsCourse.populateQuiz(key)
      }
    }
    pandemicsCourse.cloneElements(document.body);
  });

  function setupPandemics(){
    mnml.addControl("pandemicSim",{
      label:"Infection Constant",
      name:"infection_constant",
      type:"range",
      value:0.8,
      min:0,
      max:1,
      step:0.1
    })
    mnml.addControl("pandemicSim",{
      label:"Probability of Recovery",
      name:"prob_of_recovery",
      type:"range",
      value:0.9,
      min:0,
      max:1,
      step:0.1
    })
    mnml.addControl("pandemicSim",{
      label:"Closing Time",
      name:"closing_time",
      type:"range",
      value:14,
      min:5,
      max:250,
      step:1
    });

    document.querySelector("#pandemicSim").addEventListener("mnmlChange",(e)=>{
      pModel.config[e.detail.name] = e.detail.value;
    },false);

    pModel.initialise();
  }
  
  sleepCourse = new Course({
    name:"Sleep-Health",
    htmlUrl:"/sleephealth_course/sleephealth.html",
    jsonUrl:"/sleephealth_course/sleephealth.json"
  })

  sleepCourse.loaded.then(()=>{
    sleepCourse.cloneElements(document.body);
  })

  function setupSleep(){
    var quiz = document.querySelector("#sleepQuiz");
    var alreadySelected = false;
    quiz.addEventListener("click",(e)=>{
      if(e.target != e.currentTarget.children && !alreadySelected){
        e.target.classList.add("selected");
        alreadySelected = true;
      }
    },false);

    let wordCanvas = document.querySelector("#wordCanvas");
    wordCanvas.width = window.innerWidth;
    wordCanvas.height = window.innerHeight;
    let wc = wordCanvas.getContext("2d");
    wc.font = "20px Arial";
    let anim = null;
    let words = [];
    let hasStarted = false;
    mnml.addControl("wordControls",{
      label:"word",
      name:"words",
      value:"sleep",
      type:"text"
    })
    document.querySelector("#wordControls").addEventListener("mnmlChange",(e)=>{
      let x = Math.random() * wordCanvas.width;
      let y = Math.random() * wordCanvas.height;
      let a = Math.random() * Math.PI * 2;
      words.push({text:e.detail.value,x:x,y:y,a:a});
      mnml.e.controls.wordControls.elements.words.value = "";
      if(!hasStarted){
        hasStarted = true;
        renderWords();
      }
    },false);
    function renderWords(){
      wc.beginPath();
      wc.clearRect(0,0,wordCanvas.width,wordCanvas.height);
      let v = 1;
      
      words.forEach(w=>{
        let d = wc.measureText(w.text);
        if(w.x < 0 || w.x > wordCanvas.width - d.width){
          w.a += Math.PI/2;
        }
        if(w.y < 0 || w.y > wordCanvas.height - d.height){
          w.a += Math.PI/2;
        }
        w.x += v * Math.cos(w.a);
        w.y += v * Math.sin(w.a);
        /* if(w.x > wordCanvas.width + d.width){
          w.x = -d.width;
        }
        if(w.x < -d.width){
          w.x = wordCanvas.width + d.width;
        }
        if(w.y < -d.height){
          w.y = wordCanvas.height + d.height;
        }
        if(w.y > wordCanvas.height + d.height){
          w.y = -d.height;
        } */
        wc.fillText(w.text,w.x,w.y);
      });
      anim = requestAnimationFrame(renderWords);
    }
  }

  Promise.all([sleepCourse.loaded,pandemicsCourse.loaded]).then(()=>{
    mnml = new MNML();
    setupPandemics();
    setupSleep();
  })
  
}
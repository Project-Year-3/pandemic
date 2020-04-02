Elements = async function(resolve){
  E = {};
  E.body = document.body;
  E.main = document.querySelector("#main");
  E.header = document.querySelector("#header");
  E.save = document.querySelector("#save");
  E.root = document.documentElement;
  E.views = {};
  document.body.querySelectorAll(".view").forEach((e)=>{
    E.views[e.id] = e;
  });
  currentView = document.querySelector(".current.view");
  E.body.setHue = ()=>{
    E.body.style.background = "hsl("+currentView.dataset.hue+", 40%, 26%)";
    E.root.style.setProperty("--view-hue",currentView.dataset.hue);
  };
  E.body.setHue();
  var viewChange = new Event("viewChange");
  setCurrentView =function(id){
    if(currentView){
      currentView.dispatchEvent(new Event("removeCurrentView"));
      currentView.classList.remove("current");
    }
    currentView = E.views[id];
    currentView.classList.add("current");
    currentView.dispatchEvent(new Event("setCurrentView"));
    E.body.setHue();
  };
  
  if(E.header){
    E.header.addEventListener("click",(e)=>{
    if(e.target.dataset.hasOwnProperty("view")){
      setCurrentView(e.target.dataset.view);
      e.currentTarget.querySelector(".selected").classList.remove("selected");
      e.target.classList.add("selected");
    }
  },false);
    
  }
  
  //give values to inputs without values in button wrap or grid
  document.querySelectorAll(".button-wrap > div, .grid-selector > div").forEach((e)=>{
    if(!e.dataset.value){
      e.dataset.value = e.innerText;
    }
  });
  
  removeElement = (e)=>{
    var self = e.currentTarget;
    self.removeEventListener("transitionend",removeElement,false);
    self.parentElement.removeChild(self);
  }
  
  appendElement = (e)=>{
    console.log("adding!");
    self.removeEventListener("transitionend",appendElement,false);
    parent.removeChild(self);
  }
  
  document.querySelector("#notification-wrap").addEventListener("click",(e)=>{
    var el = e.target;
    if(e.target.parentElement == e.currentTarget){
      var self = e.target;
      var parent = e.currentTarget;
      e.target.addEventListener("transitionend",removeElement,false);
      e.target.classList.add("going");
    }
  },false);
  
  addNotification = function(content){
    var parent = document.querySelector("#notification-wrap");
    if(!parent){return};
    var self = document.createElement("div"); 
    self.innerHTML = content;
    self.classList.add("coming");
    parent.appendChild(self);
    setTimeout(function(){self.classList.remove("coming")});
  }
  
  document.querySelectorAll(".button-wrap, .grid-selector").forEach((el)=>{
    var inp = document.createElement("input");
    inp.type = "hidden";
    inp.name = el.dataset.name;
    el.appendChild(inp);
    if(el.querySelector(".selected")){
      inp.value = el.querySelector(".selected").dataset.value;
    }
    el.addEventListener("click",(e)=>{
      if(e.target.parentElement == e.currentTarget){
        if(e.target.classList.contains("selected")){
          e.target.classList.remove("selected");
          inp.value = "";
          return
        }
        if(e.currentTarget.querySelector(".selected")){
          e.currentTarget.querySelector(".selected").classList.remove("selected");
        }
        e.target.classList.add("selected");
        inp.value = e.target.dataset.value;
      }
    },false);
  });
  
  document.querySelectorAll(".toggle").forEach((el)=>{
    var inp = document.createElement("input");
    inp.type = "hidden";
    inp.name = el.dataset.name;
    el.appendChild(inp);
    if(el.dataset.defaultValue){
      inp.value = el.dataset.defaultValue;
    } else {
      inp.value = "";
    }
    el.addEventListener("click",(e)=>{
      el.classList.toggle("selected");
      if(el.classList.contains("selected")){
      inp.value = el.dataset.selectedValue;
    } else if(el.dataset.defaultValue){
      inp.value = el.dataset.defaultValue;
    } else {
      inp.value = "";
    };
    },false);
  });
  
  document.querySelectorAll(".number-pad").forEach((el)=>{
    var inputs = el.dataset['bind'].split(",");
    var selector = inputs.map((name)=>{return "input[name="+name+"]"}).join(",");
    var arr = [...document.querySelectorAll(selector)];
    var pad = document.createElement("div");
    el.appendChild(pad);
    var symbols = "7,8,9,4,5,6,1,2,3,0,.,bk,arr".split(",");
    symbols.forEach((s)=>{
      var d = document.createElement("div"); d.dataset.value = s; 
      if(!isNaN(s) || s == "."){d.innerHTML = s} else if(s == "bk") {
        d.style.backgroundImage = "url(elements/res/delete.svg)";
        d.classList.add("bk");
      } else if(s == "arr"){
        var l = document.createElement("div"); var r = document.createElement("div"); l.classList.add("l"); r.classList.add("r");
        l.style.backgroundImage = "url(elements/res/chevron-left.svg)"
        r.style.backgroundImage = "url(elements/res/chevron-right.svg)"
        d.appendChild(l);d.appendChild(r);
        d.classList.add("keys");
        if(arr.length < 2) {
          d.classList.add("disabled");
        }
      }
      pad.appendChild(d);
    });
    
    el.dataset.selected = document.querySelector(selector).name;
    document.querySelector(selector).focus();
    document.querySelector(selector).classList.add("selected");
    pad.addEventListener("click",(e)=>{
      var input = document.querySelector("input[name="+el.dataset.selected+"]");
      if(!isNaN(e.target.dataset.value)){
        input.value += Number(e.target.dataset.value);
      } else if(e.target.dataset.value == "bk"){
        input.value = input.value.substring(0,input.value.length-1);
      } else if(e.target.dataset.value == "."){
        input.value += ".";
      }
    },false);
    var animbk = null;
    el.querySelector(".bk").addEventListener("mousedown",()=>{
      animbk = setTimeout(()=>{
        document.querySelector(".current.view > input.selected").value = "";
      },600);
    },false);
    
    el.querySelector(".bk").addEventListener("mouseup",()=>{
      clearInterval(animbk);
    },false);
    
    document.querySelectorAll(selector).forEach((inp)=>{
      inp.setAttribute("readonly",true);
      inp.addEventListener("focus",(e)=>{
        el.dataset.selected = inp.name;
        document.querySelectorAll(".current.view > input.selected").forEach((i)=>{i.classList.remove("selected")});
        inp.classList.add("selected");
      },false);    
    });
    
    el.querySelectorAll(".keys > div").forEach((arrow)=>{
      arrow.addEventListener("click",(e)=>{
        var currentFocus = document.querySelector(".current.view > input.selected");
        var cIndex = arr.indexOf(currentFocus);
        if(arrow.classList.contains("l")){
          cIndex--; if(cIndex < 0){cIndex += arr.length};
        } else if(arrow.classList.contains("r")){
          cIndex++; cIndex %= arr.length;
        }
        currentFocus.classList.remove("selected");
        el.dataset.selected = arr[cIndex].name;
        arr[cIndex].classList.add("selected");
      },false);
    },false);
  });
  
  
  subviewChange = new Event("subviewChange");
renderSubview = (parent)=>{
    var subviews = parent.querySelectorAll(".subviews > div");
  if(subviews.length == 0){return false}; subviews[0].classList.add("current");
    var viewWrap = document.createElement("div"); viewWrap.classList.add("view-wrap");
    parent.appendChild(viewWrap);
    subviews.forEach((v)=>{
      viewWrap.appendChild(parent.removeChild(v));
    })
    var indicator = document.createElement("div"); indicator.classList.add("indicator");parent.appendChild(indicator);
    var arrowLeft = document.createElement("div"); arrowLeft.classList.add("a-left","button");
    var arrowRight = document.createElement("div"); arrowRight.classList.add("a-right", "button");
    parent.appendChild(arrowLeft); parent.appendChild(arrowRight);
    subviews.forEach((s,index)=>{
      var i = document.createElement("div");
      indicator.appendChild(i);
      i.dataset.index = index;
    });
    indicator.children[0].classList.add("current");
    
    var setPage = function(i){
      viewWrap.querySelector("div.current").classList.remove("current");
        indicator.querySelector("div.current").classList.remove("current");
        subviews[i].classList.add("current");
        indicator.children[i].classList.add("current");
      parent.dispatchEvent(new CustomEvent('subviewChange', {bubbles:true, detail: {
        page: i
      }}));
    }
    
    indicator.addEventListener("click",function(e){
      if(e.target.dataset.index !== undefined) {
        setPage(e.target.dataset.index);
      }
    },false);
    arrowLeft.addEventListener("click",function(){
      var index = indicator.querySelector(".current").dataset.index;
      index--;
      if(index < 0){
        index += subviews.length;
      }
      setPage(index);
    },false);
    arrowRight.addEventListener("click",function(){
      var index = indicator.querySelector(".current").dataset.index;
      index++;
      index %= subviews.length;
      setPage(index);
    },false);
  };

  document.querySelectorAll(".subviews").forEach(renderSubview);
  
  Elements.confirm = function(text,yestxt,notxt){
    var el = document.createElement("div"); el.classList.add("confirm","coming");
    el.innerHTML = `<span>${text}</span>`;
    var yesbtn = document.createElement("div"); yesbtn.classList.add("button");
    yesbtn.innerHTML = (yestxt)? yestxt : "yes";
    nobtn = document.createElement("div"); nobtn.classList.add("button");
    nobtn.innerHTML = (notxt)? notxt : "no";
    el.appendChild(yesbtn); el.appendChild(nobtn);
    var promise = new Promise((res,rej)=>{
      yesbtn.addEventListener("click",()=>{
        el.classList.add("going");
        res();
      },false);
      nobtn.addEventListener("click",()=>{
        el.classList.add("going");
        rej();
      },false);
    });
    
    el.addEventListener("transitionend",()=>{
      if(el.classList.contains("going")){
        el.classList.remove("going");
        el.parentElement.removeChild(el);
      }
    },false);
    
    E.main.appendChild(el);
    setTimeout(()=>{el.classList.remove("coming")});
    return promise;
  }

if(resolve){resolve(E)}};//END

startElements = function(){
  return new Promise((res,rej)=>{
  Elements(res);
});
}
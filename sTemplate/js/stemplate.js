/**
 * @file smart template library. (sTemplate.js)
 * @author 김정호
 * @since: 작성일(2015.1.31)
 * @version: 버전(0.5)
 * @see: 
 * @description: 간단하게 사용할 수 있는 Template.
 */
 
// 태그에 target속성이 없는 경우에는 field에 지정된 값이 innerHTML 또는 src에 설정됨.
// target 속성이 존재하면, type이 "attr"이면 attribute에 target이 추가되고, 아니면 element에 property로 target이 추가된다.


/**
 * @namespace stpl_config
 * @property {string} prefix - stemplate에 사용되는 attribute name의 공통적인 prefix.
 * @property {boolean} useDataSet - stemplate에 사용되는 attribute name에 "data-"를 사용할 것인지를 지정.
 * @property {property} propNames - stemplate에 사용되는 attribute name들의 집합.
 * @property {string} propNames.template - template name으로 사용되는 attribute.
 * @property {string} propNames.dummyCheck - dummyCheck로 사용되는 attribute.
 * @property {string} propNames.fixed - fixed 상태 지정에 사용되는 attribute.
 * @property {string} propNames.field - field name으로 사용되는 attribute.
 * @property {string} propNames.type - type 지정에 사용되는 attribute.
 * @property {string} propNames.target - target 지정에 사용되는 attribute.
 * @property {string} propNames.subTemplate - sub template name에 사용되는 attribute.
 * @property {string} propNames.subCheck - sub template인지 검사에 사용되는 attribute.
 * @property {property} classNames - stemplate에 사용되는 class name들의 집합.
 * @property {string} classNames.child - template으로 생성된 element에 적용되는 class name.
 * @property {string} classNames.parent - template의 parentElement에 적용되는 class name.
 * @property {boolean} designMode - design mode를 사용할 것인지를 지정.
 */
 window.stpl_config = {
  prefix: "s",
  useDataSet: false,
  propNames: {
    template: "template",
    dummyCheck: "dummy-tpl",
    fixed: "fixed",
    field: "field",
    type: "type",
    target: "target",
    subTemplate: "child-tpl",
    subCheck: "sub-tpl"
  },
  classNames: {
    child: "tplChild",
    parent: "tplParent"
  },
  designMode: true
};

if (window.stpl == undefined) {

var util = {
  inArray: function( elem, array ) {
    if ( array.indexOf ) {
      return array.indexOf( elem );
    }

    for ( var i = 0, length = array.length; i < length; i++ ) {
      if ( array[ i ] === elem ) {
        return i;
      }
    }

    return -1;
  },
  
  trim: function(str) {
    return str.replace(/^\s+|\s+$/g, "");
  },
  
  toCamel: function(str) {
    return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
  },

  toDash: function(str) {
    return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
  },
  
  hasClass: function(el, classe) {
    var className = el.className;
    if (className == undefined) {
      return false;
    }
    return (util.inArray(classe, className.split(' ')) > -1);
  },

  addClass: function(el, classe) {
    var className = el.className;
    if (className == undefined) {
      el.className = classe;
      return;
    }

    var hasClass = util.inArray(classe, className.split(' ')) > -1, outClass;

    if ( !hasClass ) {
      outClass = [className, classe].join(' ');

      el.className = util.trim(outClass);
    }
  },

  removeClass: function(el, classe) {
    if (el == undefined || el == null) {
      return;
    }
    var className = el.className;
    if (className == undefined) {
      return;
    }
    var hasClass = util.inArray(classe, className.split(' ')) > -1, outClass;

    if ( hasClass ) {
      outClass = className.replace(classe, '');

      el.className = util.trim(outClass);
    }
  },
  
  makeStr: function(props, tab) {
    if (props == null || props == undefined) {
      return props;
    }
    var type = typeof(props);
    if (type != "object") {
      return props;
    }
    var prevTab = (tab) ? tab : "";
    tab = ((tab) ? tab : "") + "\t";
    
    var str = "{\n";

    for(var key in props) {
      if (props[key] != null && props[key] != undefined) {
        str += tab + key + " : " + util.makeStr(props[key], tab) + ",\n";
      }
    }
    
    str += prevTab + "}"
    
    return str;
  }
}

/**
 * Template에 data가 적용될 때, 호출되는 함수로서 field name에 따른 value의 처리를 담당한다.
 *
 * @callback fieldCallback
 *
 * @param {element} parent Template으로 지정된 Element의 parentElement.
 * @param {element} elem Template이 적용되는 Element.
 * @param {string} key field name.
 * @param {var} value field에 적용되는 value.
 * @param {string} target 적용되는 property 또는 attribute의 name.
 * @param {string} type [ "prop" | "attr" ] property에 적용될 것인지 attribute에 적용될 것인지를 지정.
 */
 var processDefaultField = function (parent, elem, key, value, target, type) {
  if (target === undefined || target === null) {
    if (elem.src != undefined) {
      elem.src = value;
    }
    else if (elem.href != undefined) {
      elem.href = value;
    }
    else if (elem.value != undefined) {
      elem.value = value;
    }
    else {
      elem.innerHTML = value;
    }
  }
  else {
    if (type == "attr") {
      elem.setAttribute(target, value);
    }
    else { // type == "prop"
      elem[target] = value;
    }
  }
}

/**
 * Template의 정보를 관리하는 class.
 *
 * @class Template
 * @constructs Template
 * @param {string} name Template의 이름.
 * @param {element} elem Template으로 지정된 Element.
 * @param {element} parent Template으로 지정된 Element의 parentElement.
 * @param {boolean} fixed Template을 고정 상태로 사용할 것인지를 지정.
 * @param {boolean} subCheck sub template인지를 지정.
 */
function Template(name, elem, parent, fixed, subCheck) {
  this.name = name;
  this.elem = elem;
  this.parent = parent;
  this.fixed = fixed;
  this.onSetCB = processDefaultField;
  this.querySet = null;
  this.subCheck = subCheck;
}

/**
 * Template에서 전체 field의 상세 정보를 얻는다.
 *
 * @return {property} 상세 정보를 포함하는 객체.
 */
Template.prototype.getInfo = function () {
  var info = {
    name: this.name,
    fixed: this.fixed,
    subCheck: this.subCheck,
  }
  
  info.fieldInfo = window.stpl.getFieldInfo(this.elem);
  
  return info;
};

/**
 * Template를 통해 생성된 Element들을 얻는다.
 *
 * @return {array} Template를 통해 생성된 Element들의 배열.
 */
Template.prototype.getChildElemList = function() {
  var tmpChilds = [];
  var childCls = window.stpl.config.classNames.child;
  for(var i = 0; i < this.parent.children.length; i++) {
    if (util.hasClass(this.parent.children[i], childCls)) {
      tmpChilds.push(this.parent.children[i]);
    }
  }
  return tmpChilds;
};
  
/**
 * Template를 통해 생성된 Element들의 수를 얻는다.
 *
 * @return {number} Template를 통해 생성된 Element들의 수.
 */
Template.prototype.getChildCnt = function() {
  var tmpChilds = this.getChildElemList();
  return tmpChilds.length;
};

/**
 * Template를 통해 생성된 Element 중 지정된 순서에 있는 Element를 얻는다.
 *
 * @param {number} idx 얻고자 하는 Element의 index.
 * @return {element} 지정된 순서에 있는 Element.
 */
Template.prototype.getChildElem = function(idx) {
  var tmpChilds = this.getChildElemList();
  return tmpChilds[idx];
};

/**
 * Template에 data가 적용될 때, 호출되는 기본 함수로서 field name에 따른 value의 처리를 담당한다.
 *
 * @function
 * @param {element} parent Template으로 지정된 Element의 parentElement.
 * @param {element} elem Template이 적용되는 Element.
 * @param {string} key field name.
 * @param {var} value field에 적용되는 value.
 * @param {string} target 적용되는 property 또는 attribute의 name.
 * @param {string} type [ "prop" | "attr" ] property에 적용될 것인지 attribute에 적용될 것인지를 지정.
 */
Template.prototype.processField = processDefaultField;

/**
 * Template에 data가 적용될 때, 호출되는 함수를 지정한다.
 *
 * @param {fieldCallback} cb Template에 data가 적용될 때, 호출되는 함수.
 */
Template.prototype.setFieldCB = function (cb) {
  this.onSetCB = cb;
};

/**
 * Template에 data가 적용될 때, 호출되는 함수를 얻는다.
 *
 * @return  {fieldCallback} Template에 data가 적용될 때, 호출되는 함수.
 */
Template.prototype.getFieldCB = function () {
  return this.onSetCB;
};

/**
 * Template으로 element를 생성하고 지정된 data를 적용하여 parentElement에 추가한다.
 *
 * @param {property} data 적용될 data.
 * @return  {element} Template에서 생성된 element.
 */
Template.prototype.addData = function (data) {
  if (this.fixed == true) {
    return null;
  }
  var elem = this.elem.cloneNode(true);

  window.stpl.applyFieldData(elem, data, this.onSetCB, this.querySet);

  this.parent.appendChild(elem);
  
  return elem;
};

/**
 * Template으로 element를 생성하고 지정된 data를 적용하여 parentElement에 삽입한다.
 *
 * @param {property} data 적용될 data.
 * @return  {element} Template에서 생성된 element.
 */
Template.prototype.insertData = function(data, nextElem) {
  if (this.fixed == true) {
    return null;
  }
  var elem = this.elem.cloneNode(true);

  window.stpl.applyFieldData(elem, data, this.onSetCB, this.querySet);
  
  if (typeof(nextElem) == "number") {
    nextElem = this.getChildElem(nextElem);
  }

  this.parent.insertBefore(elem, nextElem);
  
  return elem;
};

/**
 * Template으로 생성된 element에 지정된 data를 적용한다.
 *
 * @param {property} data 적용될 data.
 * @param {number} idx 적용될 element의 index.(template이 fixed인 경우에는 사용되지 않음.)
 * @return  {element} data가 적용된 element.
 */
Template.prototype.setData = function(data, idx) {
  var elem = this.elem;
  if (this.fixed == false) {
    elem = this.getChildElem(idx);
  }
  if (elem != null) {
    window.stpl.applyFieldData(elem, data, this.onSetCB, this.querySet);
  }
  return elem;
},

/**
 * Template으로 생성된 element에서 지정된 data를 얻는다.
 *
 * @param {number} idx element의 index.(template이 fixed인 경우에는 사용되지 않음.)
 * @return {property} element에 지정된 data.
 */
Template.prototype.getData = function(idx) {
  var elem = this.elem;
  if (this.fixed == false) {
    elem = this.getChildElem(idx);
  }
  return elem.fieldData;
},

/**
 * Template으로 생성된 element를 제거한다.
 *
 * @param {element|number} elem 제거할 element 또는 제거할 element의 index.(template이 fixed인 경우에는 사용되지 않음.)
 * @return {element} 제거된 element.
 */
Template.prototype.removeData = function(elem) {
  if (this.fixed == true) { // fixed 이면 삭제할 수 없음
    return null;
  }
  
  if (typeof(elem) == "number") {
      elem = this.getChildElem(elem);
  }
  this.parent.removeChild(elem);
  return elem;
};

/**
 * @global
 * @type {TemplateMgr}
 */
window.stpl = new (

/**
 * Template을 관리하는 class.
 *
 * @class TemplateMgr
 */
function TemplateMgr() {
  var self = this;
  var _config = {
    propNames: {},
    classNames: {},
  };
  
  if (window.stpl_config) {
    _config.prefix =  window.stpl_config.prefix || "";
    _config.useDataSet = window.stpl_config.useDataSet || false;
    if (window.stpl_config.propNames) {
      _config.propNames.template = window.stpl_config.propNames.template || "template";
      _config.propNames.dummyCheck = window.stpl_config.propNames.dummyCheck || "dummy-tpl";
      _config.propNames.fixed = window.stpl_config.propNames.fixed || "fixed";
      _config.propNames.field = window.stpl_config.propNames.field || "field";
      _config.propNames.type = window.stpl_config.propNames.type || "type";
      _config.propNames.target = window.stpl_config.propNames.target || "target";
      _config.propNames.subTemplate = window.stpl_config.propNames.subTemplate || "child-tpl";
      _config.propNames.subCheck = window.stpl_config.propNames.subCheck || "sub-tpl";
    }
    if (window.stpl_config.classNames) {
      _config.classNames.child = window.stpl_config.classNames.child || "tplChild";
      _config.classNames.parent = window.stpl_config.classNames.child || "tplParent";
    }
    _config.designMode = window.stpl_config.designMode || true;
  }

  self.config = {
    prefix: _config.prefix,
    useDataSet: _config.useDataSet,
    propNames: {},
    dataNames: {},
    classNames: _config.classNames,
    designMode: _config.designMode
  };
  
  var data_prefix = (self.config.useDataSet) ? "data-" : "";
  var prefix = (self.config.prefix.length > 0) ? (self.config.prefix + "-") : "";
  for(var key in _config.propNames) {
    self.config.dataNames[key] = util.toCamel(prefix + _config.propNames[key]);
    self.config.propNames[key] = data_prefix + prefix + _config.propNames[key];
  };
  
  var mainArgs = window.location.search.split(/[?&]/);
  var args = {};
  for(var i = 0; i < mainArgs.length; i++) {
    var pair = mainArgs[i].split("=");
    args[pair[0]] = pair[1];
  }
  
  var designMode = self.config.designMode && (args["designMode"] == "true");
  var _propNames = self.config.propNames;
  var _dataNames = self.config.dataNames;
  var _clsNames = self.config.classNames;
  
  var _getValue = function (elem, key) {
    if (self.config.useDataSet) {
      return elem.dataset[_dataNames[key]];
    }
    else {
      return elem.getAttribute(_propNames[key]);
    }
  };
  
  self.templateList = {};

  /**
   * Template을 초기화한다.
   *
   * @function initialize
   * @memberof TemplateMgr
   * @instance
   */  
  self.initialize = function() {
    if (designMode) {
      self.emptyTpl = {
        addData: function() { return null;},
        insertData: function() { return null;},
        setData: function() { return null;},
        getData: function() { return null;},
        removeData: function() { return null;},
        removeDataAll: function() { return null;}
      }
    }
    else {
      var dummyList = document.querySelectorAll("[" + _propNames.dummyCheck + "]");
      for(var i = 0; i < dummyList.length; i++) {
        dummyList[i].parentElement.removeChild(dummyList[i]);
      }
    }
    
    self.loadTemplate();
  };
    
  /**
   * Template을 읽어들인다.
   *
   * @function loadTemplate
   * @memberof TemplateMgr
   * @instance
   *
   * @param {element} elem Template을 읽어들일 대상 element. 지정되지 않으면 document 전체에서 검색한다.
   */  
  self.loadTemplate = function(elem) {
    var targetElement = elem;
    if (arguments.length == 0) {
      targetElement = document;
    }
    var tList = targetElement.querySelectorAll("[" + _propNames.template + "]");
    for(var i = 0; i < tList.length; i++) {
      var subTpls = tList[i].querySelectorAll("[" + _propNames.template + "]");
      for (var j = 0; j < subTpls.length; j++) {
        util.addClass(subTpls[j].parentElement, _clsNames.parent);
        var subName = _getValue(subTpls[j], "template");
        subTpls[j].parentElement.setAttribute(_propNames.subTemplate, subName);
        subTpls[j].setAttribute(_propNames.subCheck, "true");
      }
      
      var name = _getValue(tList[i], "template");
      var subCheck = (_getValue(tList[i], "subCheck") == "true");
      var fixed = (_getValue(tList[i], "fixed") == "true");
      if (self.templateList[name]) {
        console.log("aleady existed template name :" + name);
        continue;
      }
      tList[i].removeAttribute(_propNames.template);
      self.templateList[name] = new Template(
        name,
        tList[i],
        tList[i].parentElement,
        fixed,
        subCheck
      );
      if (!designMode && fixed == false && tList[i].parentElement) {
        tList[i].parentElement.removeChild(tList[i]);
      }        
    }
    
    if (designMode) {
      var str = "";
      var first = true;
      for(var key in self.templateList) {
        if (first == false) {
          str += ",\n";
        }
        str += util.makeStr(self.templateList[key].getInfo());
        first = false;
      }
      console.log(str);
    }
  };
  
  /**
   * Template의 element에서 field의 상세 정보를 얻는다.
   *
   * @function getFieldInfo
   * @memberof TemplateMgr
   * @instance
   *
   * @param {element} elem 정보가 포함된 element.
   * @return {property} 상세 정보를 포함하는 객체.
   */  
  self.getFieldInfo = function(elem) {
    var info = {};
    
    var prop = elem.querySelectorAll("[" + _propNames.field + "]");
    for(var i=0; i < prop.length; i++) {
      var field = _getValue(prop[i], "field");
      var type = _getValue(prop[i], "type");
      var target = _getValue(prop[i], "target");
      info[field] = {
        tagName: prop[i].tagName,
        type: type,
        target: target,
      };
    }
    
    return info;
  };
  
  /**
   * Template에서 생성된 element의 각 field에 지정된 data를 적용한다.
   *
   * @function applyFieldData
   * @memberof TemplateMgr
   * @instance
   *
   * @param {element} elem template으로 생성된 element.
   * @param {property} data 적용될 data.
   * @param {fieldCallback} onSetCB data가 적용될 때, 세부 처리를 담당하는 함수.
   * @param {property} querySet querySet이 지정되면 template의 field 대신 querySet의 field가 사용된다. (querySet은 css selector를 통해 지정)
   */  
  self.applyFieldData = function(elem, data, onSetCB, querySet) {
    util.addClass(elem, _clsNames.child);
    var prop = elem.querySelectorAll("[" + _propNames.field + "]");
    for(var i=0; i < prop.length; i++) {
      var field = _getValue(prop[i], "field");
      var type = _getValue(prop[i], "type");
      var target = _getValue(prop[i], "target");
      if (data[field] != undefined) {
	      onSetCB(elem, prop[i], field, data[field], target, type);
	    }
    }
    if (querySet) {
      for(var field in querySet) {
        var prop = elem.querySelector(querySet[field]);
	      if (data[field] != undefined) {
	        onSetCB(elem, prop[i], field, data[field]);
	      }
      }
    }
    
    if (elem.fieldData === undefined) {
      elem.fieldData = data;
    }
    else {
      for(var key in data) {
        elem.fieldData[key] = data[key];
      }
    }
  };
  
  /**
   * 지정된 Template으로 element를 생성하고 지정된 data를 적용하여 parentElement에 추가한다.
   *
   * @function addData
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} template의 이름.
   * @param {property} data 적용될 data.
   * @param {element} parentElem 생성된 element가 추가될 parent. subtemplate인 경우에만 사용된다.
   * @return  {element} Template에서 생성된 element.
   */  
  this.addData = function(name, data, parentElem) {
    var template = self.getTemplate(name, parentElem);
    return template.addData(data);
  };

  /**
   * 지정된 Template으로 element를 생성하고 지정된 data를 적용하여 parentElement에 삽입한다.
   *
   * @function insertData
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} template의 이름.
   * @param {property} data 적용될 data.
   * @param {element} nextElem 생성된 element는 nextElem의 앞에 삽입된다.
   * @param {element} parentElem 생성된 element가 추가될 parent. subtemplate인 경우에만 사용된다.
   * @return  {element} Template에서 생성된 element.
   */  
  this.insertData = function(name, data, nextElem, parentElem) {
    var template = self.getTemplate(name, parentElem);
    return template.insertData(data, nextElem);
  };

  /**
   * 지정된 Template의 element에 지정된 data를 적용한다.
   *
   * @function setData
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} template의 이름.
   * @param {property} data 적용될 data.
   * @param {number} idx data가 적용될 element의 index.
   * @param {element} parentElem data가 적용될 element의 parent. subtemplate인 경우에만 사용된다.
   * @return  {element} data가 적용된 element.
   */  
  this.setData = function(name, data, idx, parentElem) {
    var template = self.getTemplate(name, parentElem);
    return template.setData(data, idx);
  },

  /**
   * 지정된 Template의 element에 지정된 data를 얻는다.
   *
   * @function getData
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} template의 이름.
   * @param {number} idx data를 얻어올 element의 index.
   * @param {element} parentElem data를 얻어올 element의 parent. subtemplate인 경우에만 사용된다.
   * @return  {element} element에 적용된 data.
   */  
  this.getData = function(name, idx, parentElem) {
    var template = self.getTemplate(name, parentElem);
    return template.getData(idx);
  },

  /**
   * 지정된 Template의 element를 삭제한다.
   *
   * @function removeData
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} template의 이름.
   * @param {number|element} elem 삭제할 element 또는 삭제할 element의 index.
   * @param {element} parentElem 삭제할 element의 parent. subtemplate인 경우에만 사용된다.
   * @return  {element} 삭제된 element.
   */  
  this.removeData = function(name, elem, parentElem) {
    var template = self.getTemplate(name, parentElem);
    return template.removeData(elem);
  };

  /**
   * 지정된 Template의 element를 모두 삭제한다.
   *
   * @function removeDataAll
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} template의 이름.
   * @param {element} parentElem 삭제할 element들의 parent. subtemplate인 경우에만 사용된다.
   */  
  this.removeDataAll = function(name, parentElem) {
    var template = self.getTemplate(name, parentElem);
    if (template.fixed == true) { // fixed 이면 삭제할 수 없음
      return;
    }
    
    var tmpChilds = template.getChildElemList();

    for (var i = tmpChilds.length - 1; i >= 0; i--) {
      template.parent.removeChild(tmpChilds[i]);
    }
  };
  
  /**
   * 지정된 Template을 얻는다.
   *
   * @function getTemplate
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} template의 이름.
   * @param {element} parentElem 얻어올 template의 parent. subtemplate인 경우에만 사용된다.
   * @return  {Template} template.
   */  
  this.getTemplate = function (name, parentElem) {
    if (designMode) {
      return self.emptyTpl;
    }
    
    var template = this.templateList[name];
    if (template == undefined) {
      throw "template is not exist. - " + name;
    }

    if (template.subCheck) {
      if (parentElem) {
        var subParent = null;
        if (parentElem.getAttribute(_propNames.subTemplate) == name) {
          subParent = parentElem;
        }
        else {
          subParent = parentElem.querySelector("[" + _propNames.subTemplate + "=" + name +"]");
        }
        if (subParent != null) {
          template.parent = subParent;
        }
      }
      else {
        return null;
      }
    }
    return template;
  };

  /**
   * Template에 이름을 지정한다.
   *
   * @function setTemplate
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} template의 이름.
   * @param {Template} 지정될 template.
   */  
  this.setTemplate = function (name, template) {
    self.templateList[name] = template;
  };
  
  /**
   * Template을 삭제한다.
   *
   * @function removeTemplate
   * @memberof TemplateMgr
   * @instance
   *
   * @param {string} 삭제될 template의 이름.
   * @return  {Template} 삭제된 template.
   */  
  this.removeTemplate = function(name) {
    var template = this.templateList[name];
    delete self.templateList[name];
    return template;
  };

  /**
   * Template을 모두 삭제한다.
   *
   * @function removeAllTemplate
   * @memberof TemplateMgr
   * @instance
   */  
  this.removeAllTemplate = function() {
    self.templateList.length = 0;
  };
})(); // new window.stpl

document.addEventListener('DOMContentLoaded', function(e) {
  stpl.initialize();
}, false);

} // window.stpl

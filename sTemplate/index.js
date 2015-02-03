function test() {
  var template1 = stpl.getTemplate("sample_template");
  var data1 = {
		titleLink : "#",
		title : "title1",
		imgLink : "#",
		image1 : "./image/icon_good1.png",
		desc : "desc1",
		etc : "etc1",
  } 
  template1.addData(data1);
  
  var data2 = {
		titleLink : "#",
		title : "title2",
		imgLink : "#",
		image1 : "./image/icon_good2.png",
		desc : "desc2",
		etc : "etc2",
  } 
  template1.addData(data2);

  template1.addData({
		titleLink : "#",
		title : "title3",
		imgLink : "#",
		image1 : "./image/icon_good3.png",
		desc : "desc3",
		etc : "etc3"
	});

  var template2 = stpl.getTemplate("sample_subtemplate");
  var data4 = {};
  var parent1 = template2.addData(data4);
  
  var subTemplate1 = stpl.getTemplate("sub_template", parent1);
  
  var data5 = {
		titleLink : "#",
		title : "title1",
  };
  subTemplate1.addData(data5);
  
  subTemplate1.addData({
		titleLink : "#",
		title : "title2",
  });

  subTemplate1.addData({
		titleLink : "#",
		title : "title3",
  });
  
  var data6 = {};
  var parent2 = template2.addData(data6);
  
  var subTemplate2 = stpl.getTemplate("sub_template", parent2);

  subTemplate2.addData({
		titleLink : "#",
		title : "title4",
  });

  subTemplate2.addData({
		titleLink : "#",
		title : "title5",
  });  

  subTemplate2.addData({
		titleLink : "#",
		title : "title6",
  });  
  
  var template3 = stpl.getTemplate("fixed_template");
  
  template3.setData({
    title: "1111",
    desc: "2222",
    desc2: "3333"
  });
}
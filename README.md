## s-template-js
(Automatically exported from code.google.com/p/s-template-js)

간단하게 사용할 수 있는 Javascript Template library.

Test Link :

http://jsfiddle.net/miragekjh/5fkudxoo/

http://jsfiddle.net/miragekjh/72kt8xg1/

API :

http://miragekjh2.iptime.org/MyProject/sTemplate/doc/index.html

## Usage

1.Make HTML
```
<html>
  <head>
  <title>template test</title>
  </head>
  <body>
    <table>
      <tr>
        <td style="border: solid 1px blue;">
          <a href="#"><span>test</span></a>
        </td>
      </tr>
    </table>
  </body>
</html>
```
2.Add Attribute
```
<html>
  <head>
  <title>template test</title>
  </head>
  <body>
    <table>
      <tr s-template="template1">
        <td style="border: solid 1px blue;">
          <a s-field="link1"><span s-field="text1">test</span></a>
        </td>
      </tr>
    </table>
  </body>
</html>
```
3.insert script tag (stemplate.js)
```
<html>
  <head>
  <title>template test</title>
  <!-- insert script -->
  <script src="./js/stemplate.js" type="text/javascript"></script>
  </head>
  <body>
    <table>
      <tr s-template="template1">
        <td style="border: solid 1px blue;">
          <a s-field="link1"><span s-field="text1">test</span></a>
        </td>
      </tr>
    </table>
  </body>
</html>
```
4.coding.
```
<html>
  <head>
  <title>template test</title>
  <!-- insert script -->
  <script src="./js/stemplate.js" type="text/javascript"></script>
  <script type="text/javascript">
    function load() {
      var template1 = stpl.getTemplate("template1");
      var data1 = {
        link1 : "test.html",
        text1 : "test link"
      };
      template1.addData(data1);

      var data2 = {
        link1 : "test2.html",
        text1 : "test2 link"
      };
      template1.addData(data2);

      template1.addData({
        link1 : "test3.html",
        text1 : "test3 link"
      });
    }
  </script>
  </head>
  <body onload="javascript:load();">
    <table>
      <tr s-template="template1">
        <td style="border: solid 1px blue;">
          <a s-field="link1"><span s-field="text1">test</span></a>
        </td>
      </tr>
    </table>
  </body>
</html>
```
5.save and test.


'use strict';

/**
 * @ngdoc function
 * @name latexOverlayApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the latexOverlayApp
 */
angular.module('latexOverlayApp')
  .controller('MainCtrl', function ($scope, $rootScope) {


    $scope.loadLatexCode = function () {
      var str = $rootScope.latex.code;


      var myRe = /\\annotatedFigureBox{(.*),(.*)}{(.*),(.*)}{(.*)}{(.*),(.*)}/g;

      var tag;
      $rootScope.items =[];
      while ((tag = myRe.exec(str)) !== null) {
        var msg = 'Found ' + tag[1] + '. ';
        console.log(msg);
        var item = {macro: "annotatedFigureBox", label: tag[5], x0: tag[1], y0:  tag[2], x1:  tag[3], y1: tag[4], x2:  tag[6], y2: tag[7]}

        $rootScope.items.push(item);
      }

      $scope.loadOverlays();

    }

    $scope.refreshLatexCode = function () {



      var rtn = '\\begin{annotatedFigure}\n';
      rtn = rtn + '\t{\\includegraphics[width=1.0\\linewidth]{' + $rootScope.overlay.file + '}}\n';

      for (var i = 0; i < $rootScope.items.length; i++) {

        var item = $rootScope.items[i];

        rtn = rtn + '\t\\' + item.macro + '{' + item.x0 + ',' + item.y0 + '}{' + item.x1 + ',' + item.y1 + '}{' + item.label + '}{' +  item.x2 + ',' + item.y2 + '}\n';

      }

      rtn = rtn + '\\end{annotatedFigure}\n';


      $rootScope.latex.code = rtn;


      $scope.loadOverlays();
    }


    var canvas = new fabric.Canvas('overlayCanvas', {selection: true});

    function x2dec(x){
      var rtn = 1.0 / $scope.overlay.width * x;
      return Number((rtn).toFixed(4));
    }

    function y2dec(y) {

     var rtn = 1.0 - 1.0 / $scope.overlay.height * y;
     return Number((rtn).toFixed(4));
    }

    canvas.on({
      'object:modified': function (e) {

        var obj = e.target;

        //obj.strokeWidth = obj.strokeWidth / ((obj.scaleX + obj.scaleY) / 2);
        var activeObject = canvas.getActiveObject();

        activeObject.dataItem.x0 = x2dec(activeObject.oCoords.bl.x);
        activeObject.dataItem.y0 = y2dec(activeObject.oCoords.bl.y);

        activeObject.dataItem.x1 = x2dec(activeObject.oCoords.tr.x);
        activeObject.dataItem.y1 = y2dec(activeObject.oCoords.tr.y);

        $scope.$apply();


        //activeObject.set('strokeWidth', obj.strokeWidth);
      }

    });

    var addRect = function (item, p1, width, height) {
      var rect = new fabric.Rect({
        hasBorders: false,
        fill: 'blue',
        opacity: 0.5,
        width: width,
        height: height,
        hasRotatingPoint: false,
        dataItem: item,
        //stroke: 'white',
        strokeWidth: 0,
        angle: 0
      });
      rect.setPositionByOrigin(p1, 'left', 'bottom');

      canvas.add(rect);


      var circle = new fabric.Circle({
        radius: 10,
        fill: '#eef',
        originX: 'center',
        originY: 'center'
      });

      var text = new fabric.Text(item.label, {
        fontSize: 10,
        originX: 'center',
        originY: 'center'
      });

      var group = new fabric.Group([ circle, text ], {
        left: 0,
        top: 0,
        selectable: false
      });

      var labelPosition = new fabric.Point(dec2x(item.x2), dec2y(item.y2));
      group.setPositionByOrigin(labelPosition, 'center', 'center');

      canvas.add(group);


      canvas.renderAll();

    }


    function dec2x(x){
      var rtn = x * $scope.overlay.width;
      return rtn;
    }

    function dec2y(y) {

      var rtn = $scope.overlay.height - y * $scope.overlay.height;;
      return rtn;
    }

    $scope.loadOverlays = function () {
      canvas.clear().renderAll();
      for (var i = 0; i < $scope.items.length; i++) {

        // get the current item
        var item = $scope.items[i];

        var x = dec2x(item.x0);
        var y = dec2y(item.y0)

        var p1n = new fabric.Point(x, y);

        var w = (item.x1 - item.x0) * $scope.overlay.width;
        var h = (item.y1 - item.y0) * $scope.overlay.height;


        addRect(item, p1n, w, h);
      }
    }

    function loadBackground(src) {
      var img = new Image();
      img.src = src;

      if (img.width > img.height) {
        $scope.overlay.orientation = "landscape";
        $scope.overlay.width = canvas.width;
        $scope.overlay.height = canvas.width * (img.height / img.width);

      } else {
        $scope.overlay.orientation = "portrait";
        $scope.overlay.width = canvas.height * (img.width / img.height);
        $scope.overlay.height = canvas.height;

      }

      canvas.setBackgroundImage(src, canvas.renderAll.bind(canvas), {
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        width: $scope.overlay.width,
        height: $scope.overlay.height
      });

    }

    loadBackground("images/teaser.png");
    $scope.refreshLatexCode();

    function handleImage(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var files = evt.dataTransfer.files;

      var reader = new FileReader();

      reader.onload = function (event) {
        loadBackground(event.target.result);
      }
      reader.readAsDataURL(files[0]);

    }


    function handleImageSelect(evt) {

      var files = this.files;

      var reader = new FileReader();

      reader.onload = function (event) {
        loadBackground(event.target.result);
      }
      reader.readAsDataURL(files[0]);

    }


    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    // Setup the dnd listeners.
    var dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleImage, false);

    var fileSelect = document.getElementById('fileSelect');
    fileSelect.addEventListener('change', handleImageSelect, false)

  });

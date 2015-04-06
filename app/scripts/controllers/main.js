'use strict';

angular.module('latexOverlayApp')
  .controller('RadiolistCtrl', function ($scope, $filter) {


    $scope.statuses = [
      {value: 'tl', text: 'top-left'},
      {value: 'bl', text: 'bottom-left'},
      {value: 'tr', text: 'top-right'},
      {value: 'br', text: 'bottom-right'},
      {value: 'na', text: 'custom'}
    ];

    $scope.showStatus = function () {
      var selected = $filter('filter')($scope.statuses, {value: $scope.selectedItem.position});
      return ($scope.selectedItem.position && selected.length) ? selected[0].text : 'Not set';
    };
  })
  .controller('MainCtrl', function ($scope, $rootScope, ngDialog, $http) {

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'stex',
      theme: 'default'
    };

    $scope.latex.code = $rootScope.latex.code;
    $scope.selectedItem = {};

    // canvas for the display
    var canvas = new fabric.Canvas('overlayCanvas', {selection: true});

    $scope.getFullLatex = function() {

      $http.get('v0.0.1.txt').success(function(data) {

        var code = getLatexCode();
        var rtn = data.replace("%ANNOTATED_FIGURE%", code);
        $scope.latex.code = rtn;
      });

    }

    // create latex code and load overlays
    function getLatexCode() {

      // create the latex code
      var rtn = '\\begin{annotatedFigure}\n';
      rtn = rtn + '\t{\\includegraphics[width=1.0\\linewidth]{' + $rootScope.overlay.file + '}}\n';

      for (var i = 0; i < $rootScope.overlay.items.length; i++) {

        var item = $rootScope.overlay.items[i];

        rtn = rtn + '\t\\' + item.macro + '{' + item.x0 + ',' + item.y0 + '}{' + item.x1 + ',' + item.y1 + '}{' + item.label + '}{' + item.x2 + ',' + item.y2 + '}%' + item.position + '\n';

      }

      rtn = rtn + '\\end{annotatedFigure}\n';

      return rtn;

    };


    // create latex code and load overlays
    $scope.createLatexCode = function () {

      var rtn = getLatexCode();

      $rootScope.latex.code = rtn;

    };

    $scope.changeAllLabelPosition = function () {

      for (var i = 0; i < $rootScope.overlay.items.length; i++) {

        var item = $rootScope.overlay.items[i];

        if (item.position === 'bl') {
          item.x2 = item.x0;
          item.y2 = item.y0;
        }


        if (item.position === 'tl') {
          item.x2 = item.x0;
          item.y2 = item.y1;

        }

        if (item.position === 'tr') {
          item.x2 = item.x1;
          item.y2 = item.y1;
        }

        if (item.position === 'br') {
          item.x2 = item.x1;
          item.y2 = item.y0;
        }

      }
    }

    $scope.changeLabelPosition = function (item) {


      if (item.position === 'bl') {
        item.x2 = item.x0;
        item.y2 = item.y0;
      }


      if (item.position === 'tl') {
        item.x2 = item.x0;
        item.y2 = item.y1;

      }

      if (item.position === 'tr') {
        item.x2 = item.x1;
        item.y2 = item.y1;
      }

      if (item.position === 'br') {
        item.x2 = item.x1;
        item.y2 = item.y0;
      }

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

        $rootScope.$apply(function () {
          $scope.changeLabelPosition(activeObject.dataItem);
          $scope.createLatexCode();
          $scope.redrawOverlays(); // ro reposition label
        });


        //activeObject.set('strokeWidth', obj.strokeWidth);
      }

      , 'object:selected': function (e) {
        var activeObject = canvas.getActiveObject();
        console.log(activeObject.dataItem);
        $scope.selectedItem = activeObject.dataItem;
        $rootScope.$apply();
      }
    });

    // disable group selection
    canvas.selection = false;

    $scope.clickToOpen = function (item) {

      $scope.item = item;
      ngDialog.open({
        template: 'dialogs/overlay.html',
        showClose: true,
        scope: $scope
      });
    };

    // refresh display
    $scope.redrawOverlays = function () {

      // clear the canvas
      canvas.clear().renderAll();

      // add the overlays
      for (var i = 0; i < $rootScope.overlay.items.length; i++) {

        // get the current item
        var item = $rootScope.overlay.items[i];

        addOverlay(item);

      }


    }

    // parse latex code (e.g. after change)
    $scope.parseLatexCode = function () {

      var str = $scope.latex.code;

      var myRe = /\\annotatedFigureBox{(.*),(.*)}{(.*),(.*)}{(.*)}{(.*),(.*)}%(.*)/g;

      var tag;
      $rootScope.overlay.items = [];
      while ((tag = myRe.exec(str)) !== null) {

        var item = {
          macro: "annotatedFigureBox",
          label: tag[5],
          x0: tag[1],
          y0: tag[2],
          x1: tag[3],
          y1: tag[4],
          x2: tag[6],
          y2: tag[7],
          position: tag[8]
        }

        $rootScope.overlay.items.push(item);
      }


    }

    // helper methods

    function x2dec(x) {
      var rtn = 1.0 / $scope.overlay.width * x;
      return Number((rtn).toFixed(4));
    }

    function y2dec(y) {

      var rtn = 1.0 - 1.0 / $scope.overlay.height * y;
      return Number((rtn).toFixed(4));
    }

    function dec2x(x) {
      var rtn = x * $scope.overlay.width;
      return rtn;
    }

    function dec2y(y) {

      var rtn = $scope.overlay.height - y * $scope.overlay.height;
      ;
      return rtn;
    }

    function addOverlay(item) {

      var rectPosition = new fabric.Point(dec2x(item.x0), dec2y(item.y0));

      var width = (item.x1 - item.x0) * $rootScope.overlay.width;
      var height = (item.y1 - item.y0) * $rootScope.overlay.height;

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

      rect.setPositionByOrigin(rectPosition, 'left', 'bottom');

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

      var group = new fabric.Group([circle, text], {
        left: 0,
        top: 0,
        selectable: false
      });

      var labelPosition = new fabric.Point(dec2x(item.x2), dec2y(item.y2));


      group.setPositionByOrigin(labelPosition, 'center', 'center');

      canvas.add(group);

      canvas.renderAll();

    }

    function loadImage(src, callback) {
      var img = new Image();
      img.onload = callback;
      img.src = src;
    }

    function loadBackground(src) {

      loadImage(src, function (e) {

        var img = this;

        console.log("Local image loaded locally: " + this.width + "x" + this.height);


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

        $scope.redrawOverlays();

      })


    };

    function convertPDFToData(pdf, callback) {
      PDFJS.getDocument(pdf).then(function (pdf) {
        pdf.getPage(1).then(function (page) {
          var scale = 1;
          var viewport = page.getViewport(scale);

          var offscreenCanvas = document.getElementById('offscreenCanvas');
          offscreenCanvas.height = viewport.height;
          offscreenCanvas.width = viewport.width;

          var context = offscreenCanvas.getContext('2d');

          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var pageRendering = page.render(renderContext).then(function () {
            callback(offscreenCanvas.toDataURL());
          })


        });

      });
    }

    var fileSelect = document.getElementById('fileSelect');
    $('[data-toggle="tooltip"]').tooltip();

    fileSelect.addEventListener('change', function (e) {

      var file = fileSelect.files[0];

      var reader = new FileReader();

      reader.onload = function (e) {
        $rootScope.overlay.file = file.name;
        console.log(file.name);

        var extension = file.name.split('.').pop().toLowerCase();

        if (extension == 'pdf') {
          console.log("Convert pdf file...");
          convertPDFToData(reader.result, function (data) {

            loadBackground(data);

            $rootScope.$apply(function () {
              $scope.createLatexCode();
              $scope.redrawOverlays(); // ro reposition label
            });

          });

        } else {

          loadBackground(reader.result);

          $rootScope.$apply(function () {
            $scope.createLatexCode();
            $scope.redrawOverlays(); // ro reposition label
          });
        }
      }

      reader.readAsDataURL(file);

    })


    $scope.createLatexCode();
    loadBackground('black-demo.png');


  });

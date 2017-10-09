/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args); 
                timeout = null; 
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100); 
        };
    };

    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

	
	
// Sidebar
function init_sidebar() {
	// TODO: This is some kind of easy fix, maybe we can improve this
	var setContentHeight = function () {
		// reset height
		$RIGHT_COL.css('min-height', $(window).height());

		var bodyHeight = $BODY.outerHeight(),
			footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
			leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
			contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

		// normalize content
		contentHeight -= $NAV_MENU.height() + footerHeight;

		$RIGHT_COL.css('min-height', contentHeight);
	};

  $SIDEBAR_MENU.find('a').on('click', function(ev) {
	  console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }else
            {
				if ( $BODY.is( ".nav-sm" ) )
				{
					$SIDEBAR_MENU.find( "li" ).removeClass( "active active-sm" );
					$SIDEBAR_MENU.find( "li ul" ).slideUp();
				}
			}
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

	// toggle small or large menu 
	$MENU_TOGGLE.on('click', function() {
			console.log('clicked - menu toggle');
			
			if ($BODY.hasClass('nav-md')) {
				$SIDEBAR_MENU.find('li.active ul').hide();
				$SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
			} else {
				$SIDEBAR_MENU.find('li.active-sm ul').show();
				$SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
			}

		$BODY.toggleClass('nav-md nav-sm');

		setContentHeight();

		$('.dataTable').each ( function () { $(this).dataTable().fnDraw(); });
	});

		// check active menu
		$SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

		$SIDEBAR_MENU.find('a').filter(function () {
			return this.href == CURRENT_URL;
		}).parent('li').addClass('current-page').parents('ul').slideDown(function() {
			setContentHeight();
		}).parent().addClass('active');

		// recompute content when resizing
		$(window).smartresize(function(){  
			setContentHeight();
		});

		setContentHeight();

		// fixed sidebar
		if ($.fn.mCustomScrollbar) {
			$('.menu_fixed').mCustomScrollbar({
				autoHideScrollbar: true,
				theme: 'minimal',
				mouseWheel:{ preventDefault: true }
			});
		}
	};
	var randNum = function() {
	  return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
};


// Panel toolbox
$(document).ready(function() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');
        
        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200); 
            $BOX_PANEL.css('height', 'auto');  
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// Switchery
$(document).ready(function() {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery

// iCheck
$(document).ready(function() {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

// Accordion
$(document).ready(function() {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}
	  //hover and retain popover when on popover content
        var originalLeave = $.fn.popover.Constructor.prototype.leave;
        $.fn.popover.Constructor.prototype.leave = function(obj) {
          var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
          var container, timeout;

          originalLeave.call(this, obj);

          if (obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover');
            timeout = self.timeout;
            container.one('mouseenter', function() {
              //We entered the actual popover – call off the dogs
              clearTimeout(timeout);
              //Let's monitor popover content instead
              container.one('mouseleave', function() {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
              });
            });
          }
        };

        $('body').popover({
          selector: '[data-popover]',
          trigger: 'click hover',
          delay: {
            show: 50,
            hide: 400
          }
        });
	   
	 /* AUTOSIZE */
		function init_autosize() {
			
			if(typeof $.fn.autosize !== 'undefined'){
			
			autosize($('.resizable_textarea'));
			
			}
			
		};  
	   
		/* PARSLEY */	
		function init_parsley() {
			
			if( typeof (parsley) === 'undefined'){ return; }
			console.log('init_parsley');
			
			$/*.listen*/('parsley:field:validate', function() {
			  validateFront();
			});
			$('#demo-form .btn').on('click', function() {
			  $('#demo-form').parsley().validate();
			  validateFront();
			});
			var validateFront = function() {
			  if (true === $('#demo-form').parsley().isValid()) {
				$('.bs-callout-info').removeClass('hidden');
				$('.bs-callout-warning').addClass('hidden');
			  } else {
				$('.bs-callout-info').addClass('hidden');
				$('.bs-callout-warning').removeClass('hidden');
			  }
			};
		  
			$/*.listen*/('parsley:field:validate', function() {
			  validateFront();
			});
			$('#demo-form2 .btn').on('click', function() {
			  $('#demo-form2').parsley().validate();
			  validateFront();
			});
			var validateFront = function() {
			  if (true === $('#demo-form2').parsley().isValid()) {
				$('.bs-callout-info').removeClass('hidden');
				$('.bs-callout-warning').addClass('hidden');
			  } else {
				$('.bs-callout-info').addClass('hidden');
				$('.bs-callout-warning').removeClass('hidden');
			  }
			};
			
			  try {
				hljs.initHighlightingOnLoad();
			  } catch (err) {}
			
		};
	   
		/* INPUTS */

		function onAddTag(tag) {
			alert("Added a tag: " + tag);
			}

			function onRemoveTag(tag) {
			alert("Removed a tag: " + tag);
			}

			function onChangeTag(input, tag) {
			alert("Changed a tag: " + tag);
			}

			//tags input
		function init_TagsInput() {
				
			if(typeof $.fn.tagsInput !== 'undefined'){	
				
			$('#tags_1').tagsInput({
				width: 'auto'
			});
			
			}
			
		};
	   
		/* SELECT2 */
		function init_select2() {
			 
			if( typeof (select2) === 'undefined'){ return; }
			console.log('init_toolbox');
			 
			$(".select2_single").select2({
			  placeholder: "Select a state",
			  allowClear: true
			});
			$(".select2_group").select2({});
			$(".select2_multiple").select2({
			  maximumSelectionLength: 4,
			  placeholder: "With Max Selection limit 4",
			  allowClear: true
			});
			
		};
	   
	   /* WYSIWYG EDITOR */
		function init_wysiwyg() {	
			if( typeof ($.fn.wysiwyg) === 'undefined'){ return; }
			console.log('init_wysiwyg');	
			
        function init_ToolbarBootstrapBindings() {
          var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
              'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
              'Times New Roman', 'Verdana'
            ],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
          $.each(fonts, function(idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
          });
          $('a[title]').tooltip({
            container: 'body'
          });
          $('.dropdown-menu input').click(function() {
              return false;
            })
            .change(function() {
              $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');
            })
            .keydown('esc', function() {
              this.value = '';
              $(this).change();
            });

          $('[data-role=magic-overlay]').each(function() {
            var overlay = $(this),
              target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
          });

          if ("onwebkitspeechchange" in document.createElement("input")) {
            var editorOffset = $('#editor').offset();

            $('.voiceBtn').css('position', 'absolute').offset({
              top: editorOffset.top,
              left: editorOffset.left + $('#editor').innerWidth() - 35
            });
          } else {
            $('.voiceBtn').hide();
          }
        }

        function showErrorAlert(reason, detail) {
          var msg = '';
          if (reason === 'unsupported-file-type') {
            msg = "Unsupported format " + detail;
          } else {
            console.log("error uploading file", reason, detail);
          }
          $('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' +
            '<strong>File upload error</strong> ' + msg + ' </div>').prependTo('#alerts');
        }

       $('.editor-wrapper').each(function(){
			var id = $(this).attr('id');	//editor-one
			
			$(this).wysiwyg({
				toolbarSelector: '[data-target="#' + id + '"]',
				fileUploadError: showErrorAlert
				});	
			});
 		
        window.prettyPrint;
        prettyPrint();

    };
	  
	/* CROPPER */
		function init_cropper() {
			if( typeof ($.fn.cropper) === 'undefined'){ return; }
			console.log('init_cropper');
			
			var $image = $('#image');
			var $download = $('#download');
			var $dataX = $('#dataX');
			var $dataY = $('#dataY');
			var $dataHeight = $('#dataHeight');
			var $dataWidth = $('#dataWidth');
			var $dataRotate = $('#dataRotate');
			var $dataScaleX = $('#dataScaleX');
			var $dataScaleY = $('#dataScaleY');
			var options = {
				  aspectRatio: 16 / 9,
				  preview: '.img-preview',
				  crop: function (e) {
					$dataX.val(Math.round(e.x));
					$dataY.val(Math.round(e.y));
					$dataHeight.val(Math.round(e.height));
					$dataWidth.val(Math.round(e.width));
					$dataRotate.val(e.rotate);
					$dataScaleX.val(e.scaleX);
					$dataScaleY.val(e.scaleY);
				  }
				};


			// Tooltip
			$('[data-toggle="tooltip"]').tooltip();


			// Cropper
			$image.on({
			  'build.cropper': function (e) {
				console.log(e.type);
			  },
			  'built.cropper': function (e) {
				console.log(e.type);
			  },
			  'cropstart.cropper': function (e) {
				console.log(e.type, e.action);
			  },
			  'cropmove.cropper': function (e) {
				console.log(e.type, e.action);
			  },
			  'cropend.cropper': function (e) {
				console.log(e.type, e.action);
			  },
			  'crop.cropper': function (e) {
				console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
			  },
			  'zoom.cropper': function (e) {
				console.log(e.type, e.ratio);
			  }
			}).cropper(options);


			// Buttons
			if (!$.isFunction(document.createElement('canvas').getContext)) {
			  $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
			}

			if (typeof document.createElement('cropper').style.transition === 'undefined') {
			  $('button[data-method="rotate"]').prop('disabled', true);
			  $('button[data-method="scale"]').prop('disabled', true);
			}


			// Download
			if (typeof $download[0].download === 'undefined') {
			  $download.addClass('disabled');
			}


			// Options
			$('.docs-toggles').on('change', 'input', function () {
			  var $this = $(this);
			  var name = $this.attr('name');
			  var type = $this.prop('type');
			  var cropBoxData;
			  var canvasData;

			  if (!$image.data('cropper')) {
				return;
			  }

			  if (type === 'checkbox') {
				options[name] = $this.prop('checked');
				cropBoxData = $image.cropper('getCropBoxData');
				canvasData = $image.cropper('getCanvasData');

				options.built = function () {
				  $image.cropper('setCropBoxData', cropBoxData);
				  $image.cropper('setCanvasData', canvasData);
				};
			  } else if (type === 'radio') {
				options[name] = $this.val();
			  }

			  $image.cropper('destroy').cropper(options);
			});


			// Methods
			$('.docs-buttons').on('click', '[data-method]', function () {
			  var $this = $(this);
			  var data = $this.data();
			  var $target;
			  var result;

			  if ($this.prop('disabled') || $this.hasClass('disabled')) {
				return;
			  }

			  if ($image.data('cropper') && data.method) {
				data = $.extend({}, data); // Clone a new one

				if (typeof data.target !== 'undefined') {
				  $target = $(data.target);

				  if (typeof data.option === 'undefined') {
					try {
					  data.option = JSON.parse($target.val());
					} catch (e) {
					  console.log(e.message);
					}
				  }
				}

				result = $image.cropper(data.method, data.option, data.secondOption);

				switch (data.method) {
				  case 'scaleX':
				  case 'scaleY':
					$(this).data('option', -data.option);
					break;

				  case 'getCroppedCanvas':
					if (result) {

					  // Bootstrap's Modal
					  $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

					  if (!$download.hasClass('disabled')) {
						$download.attr('href', result.toDataURL());
					  }
					}

					break;
				}

				if ($.isPlainObject(result) && $target) {
				  try {
					$target.val(JSON.stringify(result));
				  } catch (e) {
					console.log(e.message);
				  }
				}

			  }
			});

			// Keyboard
			$(document.body).on('keydown', function (e) {
			  if (!$image.data('cropper') || this.scrollTop > 300) {
				return;
			  }

			  switch (e.which) {
				case 37:
				  e.preventDefault();
				  $image.cropper('move', -1, 0);
				  break;

				case 38:
				  e.preventDefault();
				  $image.cropper('move', 0, -1);
				  break;

				case 39:
				  e.preventDefault();
				  $image.cropper('move', 1, 0);
				  break;

				case 40:
				  e.preventDefault();
				  $image.cropper('move', 0, 1);
				  break;
			  }
			});

			// Import image
			var $inputImage = $('#inputImage');
			var URL = window.URL || window.webkitURL;
			var blobURL;

			if (URL) {
			  $inputImage.change(function () {
				var files = this.files;
				var file;

				if (!$image.data('cropper')) {
				  return;
				}

				if (files && files.length) {
				  file = files[0];

				  if (/^image\/\w+$/.test(file.type)) {
					blobURL = URL.createObjectURL(file);
					$image.one('built.cropper', function () {

					  // Revoke when load complete
					  URL.revokeObjectURL(blobURL);
					}).cropper('reset').cropper('replace', blobURL);
					$inputImage.val('');
				  } else {
					window.alert('Please choose an image file.');
				  }
				}
			  });
			} else {
			  $inputImage.prop('disabled', true).parent().addClass('disabled');
			}
			
			
		};
			  
		/* KNOB */
		function init_knob() {
		
				if( typeof ($.fn.knob) === 'undefined'){ return; }
				console.log('init_knob');
	
				$(".knob").knob({
				  change: function(value) {
					//console.log("change : " + value);
				  },
				  release: function(value) {
					//console.log(this.$.attr('value'));
					console.log("release : " + value);
				  },
				  cancel: function() {
					console.log("cancel : ", this);
				  },
				  /*format : function (value) {
				   return value + '%';
				   },*/
				  draw: function() {

					// "tron" case
					if (this.$.data('skin') == 'tron') {

					  this.cursorExt = 0.3;

					  var a = this.arc(this.cv) // Arc
						,
						pa // Previous arc
						, r = 1;

					  this.g.lineWidth = this.lineWidth;

					  if (this.o.displayPrevious) {
						pa = this.arc(this.v);
						this.g.beginPath();
						this.g.strokeStyle = this.pColor;
						this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
						this.g.stroke();
					  }

					  this.g.beginPath();
					  this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
					  this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
					  this.g.stroke();

					  this.g.lineWidth = 2;
					  this.g.beginPath();
					  this.g.strokeStyle = this.o.fgColor;
					  this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
					  this.g.stroke();

					  return false;
					}
				  }
				  
				});

				// Example of infinite knob, iPod click wheel
				var v, up = 0,
				  down = 0,
				  i = 0,
				  $idir = $("div.idir"),
				  $ival = $("div.ival"),
				  incr = function() {
					i++;
					$idir.show().html("+").fadeOut();
					$ival.html(i);
				  },
				  decr = function() {
					i--;
					$idir.show().html("-").fadeOut();
					$ival.html(i);
				  };
				$("input.infinite").knob({
				  min: 0,
				  max: 20,
				  stopper: false,
				  change: function() {
					if (v > this.cv) {
					  if (up) {
						decr();
						up = 0;
					  } else {
						up = 1;
						down = 0;
					  }
					} else {
					  if (v < this.cv) {
						if (down) {
						  incr();
						  down = 0;
						} else {
						  down = 1;
						  up = 0;
						}
					  }
					}
					v = this.cv;
				  }
				});
				
		};
	 
		/* INPUT MASK */	
		function init_InputMask() {
			if( typeof ($.fn.inputmask) === 'undefined'){ return; }
			console.log('init_InputMask');
			
				$(":input").inputmask();
				
		}
	   
	   /* SMART WIZARD */
		function init_SmartWizard() {
			if( typeof ($.fn.smartWizard) === 'undefined'){ return; }
			console.log('init_SmartWizard');
			
			$('#wizard').smartWizard();

			$('#wizard_verticle').smartWizard({
			  transitionEffect: 'slide'
			});

			$('.buttonNext').addClass('btn btn-success');
			$('.buttonPrevious').addClass('btn btn-primary');
			$('.buttonFinish').addClass('btn btn-default');
			
		}
	   
	  /* VALIDATOR */
	  function init_validator () {
			if( typeof (validator) === 'undefined'){ return; }
			console.log('init_validator'); 
			
			// initialize the validator function
				validator.message.date = 'not a real date';

				// validate a field on "blur" event, a 'select' on 'change' event & a '.reuired' classed multifield on 'keyup':
				$('form')
					.on('blur', 'input[required], input.optional, select.required', validator.checkField)
					.on('change', 'select.required', validator.checkField)
					.on('keypress', 'input[required][pattern]', validator.keypress);

				$('.multi.required').on('keyup blur', 'input', function() {
					validator.checkField.apply($(this).siblings().last()[0]);
				});

				$('form').submit(function(e) {
					e.preventDefault();
					var submit = true;

					// evaluate the form using generic validaing
					if (!validator.checkAll($(this))) {
						submit = false;
					}

					if (submit)
						this.submit();

					return false;
			});
	  
	  }
	   
	  	/* PNotify */		
		function init_PNotify() {
			
			if( typeof (PNotify) === 'undefined'){ return; }
			console.log('init_PNotify');
			
			new PNotify({
			  title: "PNotify",
			  type: "info",
			  text: "Welcome. Try hovering over me. You can click things behind me, because I'm non-blocking.",
			  nonblock: {
				  nonblock: true
			  },
			  addclass: 'dark',
			  styling: 'bootstrap3',
			  hide: false,
			  before_close: function(PNotify) {
				PNotify.update({
				  title: PNotify.options.title + " - Enjoy your Stay",
				  before_close: null
				});

				PNotify.queueRemove();

				return false;
			  }
			});

		}
	   
	   
	   /* CUSTOM NOTIFICATION */
		function init_CustomNotification() {
			
			console.log('run_customtabs');

			if( typeof (CustomTabs) === 'undefined'){ return; }
			console.log('init_CustomTabs');
			
			var cnt = 10;

			TabbedNotification = function(options) {
			  var message = "<div id='ntf" + cnt + "' class='text alert-" + options.type + "' style='display:none'><h2><i class='fa fa-bell'></i> " + options.title +
				"</h2><div class='close'><a href='javascript:;' class='notification_close'><i class='fa fa-close'></i></a></div><p>" + options.text + "</p></div>";

			  if (!document.getElementById('custom_notifications')) {
				alert('doesnt exists');
			  } else {
				$('#custom_notifications ul.notifications').append("<li><a id='ntlink" + cnt + "' class='alert-" + options.type + "' href='#ntf" + cnt + "'><i class='fa fa-bell animated shake'></i></a></li>");
				$('#custom_notifications #notif-group').append(message);
				cnt++;
				CustomTabs(options);
			  }
			};

			CustomTabs = function(options) {
			  $('.tabbed_notifications > div').hide();
			  $('.tabbed_notifications > div:first-of-type').show();
			  $('#custom_notifications').removeClass('dsp_none');
			  $('.notifications a').click(function(e) {
				e.preventDefault();
				var $this = $(this),
				  tabbed_notifications = '#' + $this.parents('.notifications').data('tabbed_notifications'),
				  others = $this.closest('li').siblings().children('a'),
				  target = $this.attr('href');
				others.removeClass('active');
				$this.addClass('active');
				$(tabbed_notifications).children('div').hide();
				$(target).show();
			  });
			};

			CustomTabs();

			var tabid = idname = '';

			$(document).on('click', '.notification_close', function(e) {
			  idname = $(this).parent().parent().attr("id");
			  tabid = idname.substr(-2);
			  $('#ntf' + tabid).remove();
			  $('#ntlink' + tabid).parent().remove();
			  $('.notifications a').first().addClass('active');
			  $('#notif-group div').first().css('display', 'block');
			});
		}

		function getQueryVariable(variable)	{
				var query = window.location.search.substring(1);
				var vars = query.split("&");
				for (var i=0; i < vars.length; i++) {
						var pair = vars[i].split("=");
						if (pair[0] == variable){ return pair[1]; }
				}
				return(false);
		}

		/* USER PROFILE */
		function init_userProfile(user_id, user_avatar) {
			document.getElementById("user_profile_id").textContent= user_id;
			document.getElementById("user_profile").href = "https://github.com/" + user_id;
			document.getElementById("user_avatar").src = user_avatar;
		}

		/* PROFILE TILES */
		function tile_rating(avg_rating, avg_rating_before_discussion) {
			document.getElementById("tile_rating").textContent = Number(avg_rating).toFixed(2);
			document.getElementById("tile_rating_before_discussion").textContent = Number(avg_rating_before_discussion).toFixed(2);
        }

		function tile_necessity(avg_necessity) {
			document.getElementById("tile_necessity").textContent = Number(avg_necessity).toFixed(2);
		}

		function tile_review_time(avg_review_time) {
			document.getElementById("tile_review_time").textContent = String(Number(avg_review_time).toFixed(2)) + " min.";
		}

		/* PROFILE CHARTS */
		function chart_rating(ratings, ratings_bd, user_id, datatable_modal) {
			var ctx = document.getElementById('chart_rating').getContext('2d');
            var chart = new Chart(ctx, {
					// The type of chart we want to create
					type: 'bar',
					// The data for our dataset
					data: {
							labels: ["1", "2", "3", "4", "5"],
							datasets: [{
									label: "Before discussion",
									data: ratings_bd,
									backgroundColor: "#26B99A"
							}, 
							{
								label: 'After Discussion',
								backgroundColor: "#03586A",
								data: ratings
								}]
					},
					// Configuration options go here
					options: {
                        layout: {
                            padding: {
                                left: 4,
                                right: 4,
                                top: 4,
                                bottom: 4
                            }},
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
			});
            var context = document.getElementById('chart_rating');
            context.addEventListener('click', function(event) {
                var clickedElementindex = chart.getElementsAtEvent(event)[0]._index;
                var datasetIndex = chart.getDatasetAtEvent(event)[0]._datasetIndex;
                var action = datasetIndex == 0 ? 'rating_before_discussion' : 'rating';
                var label = chart.data.labels[clickedElementindex];
                $('#rating_modal').iziModal('setTitle', 'Reviewability rating');
                $('#rating_modal').iziModal('setSubtitle', 'Patches that were rated ' + label + (datasetIndex == 0 ? ' before discussion': ' after discussion'));
                $('#rating_modal').iziModal('open');
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/modal", false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    "param": action,
                    "user_id": user_id,
                    "label": label
                }));
                if (xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText);
                    datatable_clear(datatable_modal);
                    datatable_fill(response, datatable_modal);
                }
                else {
                    // TODO: Display error message
                }
            });
			return chart;
		}

		function chart_necessity(necessity, user_id, datatable_modal) {
			var ctx = document.getElementById('chart_necessity').getContext('2d');
			var chart = new Chart(ctx, {
					type: 'bar',
					data: {
							labels: ["1", "2", "3", "4", "5"],
							datasets: [{
									label: "Number of patches",
									data: necessity,
									backgroundColor: "#26B99A"
							}]
					},
					options: {
                        layout: {
                            padding: {
                                left: 4,
                                right: 4,
                                top: 4,
                                bottom: 4
                            }},
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
			});
            var context = document.getElementById('chart_necessity');
            context.addEventListener('click', function(event) {
                var clickedElementindex = chart.getElementsAtEvent(event)[0]._index;
                var label = chart.data.labels[clickedElementindex];
                $('#rating_modal').iziModal('setTitle', 'Patch necessity');
                $('#rating_modal').iziModal('setSubtitle', 'Patches that were rated ' + label);
                $('#rating_modal').iziModal('open');
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/modal", false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    "param": "necessity",
                    "user_id": user_id,
                    "label": label
                }));
                if (xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText);
                    datatable_clear(datatable_modal);
                    datatable_fill(response, datatable_modal);
                }
                else {
                    // TODO: Display error message
                }
            });
			return chart;
		}

		function chart_review_time(review_times, user_id, datatable_modal) {
			var ctx = document.getElementById('chart_review_time').getContext('2d');
			var chart = new Chart(ctx, {
					type: 'line',
					data: {
							labels: ["0-4", "5-9", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60+"],
							datasets: [{
									label: "Number of patches",
									data: review_times,
									borderColor: "#03586A",
									backgroundColor: "#B5C8CC",
									lineTension: 0
							}]
					},
                options: {
                    layout: {
                    padding: {
                        left: 4,
                        right: 4,
                        top: 4,
                        bottom: 4
                    }},
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
			});
            var context = document.getElementById('chart_review_time');
            context.addEventListener('click', function(event) {
                var clickedElementindex = chart.getElementsAtEvent(event)[0]._index;
                var label = chart.data.labels[clickedElementindex];
                $('#rating_modal').iziModal('setTitle', 'Patch review time');
                $('#rating_modal').iziModal('setSubtitle', 'Patches that took ' + label + ' minutes to review');
                $('#rating_modal').iziModal('open');
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/modal", false);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({
                    "param": "review_time",
                    "user_id": user_id,
                    "label": label
                }));
                if (xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText);
                    remove_children(datatable_modal);
                    datatable_fill(response, datatable_modal);
                }
                else {
                    // TODO: Display error message
                }
            });
			return chart;
		}

		function chart_rating_update(chart, ratings, ratings_bd) {
            chart.data.datasets[0].data = ratings_bd;
            chart.data.datasets[1].data = ratings;
            chart.update();
        }

        function chart_necessity_update(chart, necessity) {
            chart.data.datasets[0].data = necessity;
            chart.update();
        }

        function chart_review_time_update(chart, review_times) {
            chart.data.datasets[0].data = review_times;
            chart.update();
        }

        /* FEEDBACK COMMENTS */
		function feedback_comments(comments, field) {
            var list = document.getElementById(field);
            for (var i = 0; i < comments.length; i++) {
            	comment = comments[i];
            	var excerptP = document.createElement("p");
            	excerptP.className = "excerpt";
            	excerptP.textContent = comment[0];

                var a = document.createElement('a');
                a.setAttribute('href', comment[2]);
                a.innerHTML = comment[1];

            	var bylineDiv = document.createElement("div");
            	bylineDiv.className = "byline";
            	bylineDiv.appendChild(a);

				var contentDiv = document.createElement("div");
				contentDiv.className = "block_content";
				contentDiv.appendChild(excerptP);
				contentDiv.appendChild(bylineDiv);

            	var blockDiv = document.createElement("div");
                blockDiv.className = "block";
                blockDiv.appendChild(contentDiv);

                var entry = document.createElement('li');
                entry.appendChild(blockDiv);
                list.appendChild(entry);
                list.appendChild(document.createElement('br'))
			}
        }

    /* DATATABLE */
    function datatable_fill(rows, datatable_obj) {
            datatable_obj.rows.add(rows).draw()
    }

    function datatable_clear(datatable_obj) {
        datatable_obj.clear();
    }

    function remove_children(nodeid) {
        var myNode = document.getElementById(nodeid);
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
    }
	
	$(document).ready(function() {
		init_sidebar();

		// GET PROFILE STATS
        var user_id = getQueryVariable("userid");
        var xhr = new XMLHttpRequest();
        var chartobj_rating, chartobj_necessity, chartobj_review_time;

        // INIT Datatable
        $("#rating_modal").iziModal(
            {width: 1000,
                radius: 5,
                padding: 10,
                headerColor: "#03586A"});
        var datatable_main = $('#datatable').DataTable();
        $('#rating_modal').iziModal('open');
        var datatable_modal = $('#datatable_modal').DataTable();
        $('#rating_modal').iziModal('close');
        xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/profile", false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "action": "fetch",
            "user_id": user_id
        }));
        $("#modal_login").iziModal();
        if (xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            tile_rating(response.avg_rating, response.avg_rating_before_discussion);
            tile_necessity(response.avg_necessity);
            tile_review_time(response.avg_review_time);
            chartobj_rating = chart_rating(response.ratings, response.ratings_before_discussion, user_id, datatable_modal);
            chartobj_necessity = chart_necessity(response.necessity_ratings, user_id, datatable_modal);
            chartobj_review_time = chart_review_time(response.review_times, user_id, datatable_modal);
            feedback_comments(response.positive_comments, 'positive_comments');
            feedback_comments(response.negative_comments, 'negative_comments');
            datatable_fill(response.datatable, datatable_main);
            var user_login = response.user_id;
            var avatar_url = response.avatar_url
        }
        else if (xhr.status == 403) {
            $("#modal_login").iziModal('open');
        }
        else {
            // TODO: DISPLAY ERROR MESSAGE HERE
        }

		// DATE & USER PROFILE INIT
        $('input[name="daterange"]').daterangepicker();
        $('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
            var user_id = getQueryVariable("userid");
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/profile", false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                "action": "fetch_ranged",
                "user_id": user_id,
                "start_date": picker.startDate.format('YYYY-MM-DD'),
                "end_date": picker.endDate.format('YYYY-MM-DD')
            }));
            if (xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                tile_rating(response.avg_rating, response.avg_rating_before_discussion);
                tile_necessity(response.avg_necessity);
                tile_review_time(response.avg_review_time);
                chart_rating_update(chartobj_rating, response.ratings, response.ratings_before_discussion);
                chart_necessity_update(chartobj_necessity, response.necessity_ratings);
                chart_review_time_update(chartobj_review_time, response.review_times);
                remove_children('positive_comments');
                feedback_comments(response.positive_comments, 'positive_comments');
                remove_children('negative_comments');
                feedback_comments(response.negative_comments, 'negative_comments');
                datatable_clear(datatable_main);
                datatable_fill(response.datatable, datatable_main);
        }
        else {
                // TODO: Display ERROR message as iziToast
            }
        });

        init_userProfile(user_login, avatar_url);

		init_wysiwyg();
		init_InputMask();
		init_cropper();
		init_knob();
		init_TagsInput();
		init_parsley();
		init_SmartWizard();
		init_select2();
		init_validator();
		init_PNotify();
		init_CustomNotification();
		init_autosize();				
	});	
	


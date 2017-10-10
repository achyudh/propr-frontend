var isRanged = false;
var range_start_date = null;
var range_end_date = null;
var current_repo = null;

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

function getQueryVariable(variable)	{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable){ return pair[1]; }
    }
    return(false);
}

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

// Tooltip
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}

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
                    "label": label,
                    "action": isRanged ? "fetch_ranged" : "fetch",
                    "start_date": range_start_date,
                    "end_date": range_end_date,
                    "repo_name": current_repo
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
                    "label": label,
                    "action": isRanged ? "fetch_ranged" : "fetch",
                    "start_date": range_start_date,
                    "end_date": range_end_date,
                    "repo_name": current_repo
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
                    "label": label,
					"action": isRanged ? "fetch_ranged" : "fetch",
					"start_date": range_start_date,
					"end_date": range_end_date,
                    "repo_name": current_repo
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

    function init_repo_menu(response, user_id, chartobj_rating, chartobj_necessity, chartobj_review_time, datatable_main) {
    	var div = document.getElementById('repo_menu');
        for (var i = 0; i < response.length; i++) {
        	var list_el = document.createElement('li');
            var link = document.createElement('a');
            link.setAttribute('href', '#');
            link.innerHTML = response[i];
            link.onclick = (function() {
                var curr_repo = response[i];
                return function() {
                	current_repo = curr_repo;
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/repo", false);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                        "action": isRanged ? "fetch_ranged" : "fetch",
                        "start_date": range_start_date,
                        "end_date": range_end_date,
                        "user_id": user_id,
						"repo_name": current_repo
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
                }
            })();
            list_el.appendChild(link);
            div.appendChild(list_el);
        }
    }
	
	$(document).ready(function() {
		init_sidebar();
		document.getElementById('profile_menu').href = window.location.href;

		// GET PROFILE STATS
        var user_id = getQueryVariable("userid");
        var xhr = new XMLHttpRequest();
        var chartobj_rating, chartobj_necessity, chartobj_review_time;

        // INIT Datatable
        var datatable_main = $('#datatable').DataTable();
        $("#rating_modal").iziModal(
            {width: 1000,
                radius: 5,
                padding: 10,
                headerColor: "#03586A"});
        $('#rating_modal').iziModal('open');
        var datatable_modal = $('#datatable_modal').DataTable();
        $('#rating_modal').iziModal('close');
        $("#modal_login").iziModal();
        xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/profile", false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "action": "fetch",
            "user_id": user_id
        }));
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

        xhr = new XMLHttpRequest();
        xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/repo", false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "action": "fetch_info",
            "user_id": user_id,
        }));
        if (xhr.status == 200) {
            response = JSON.parse(xhr.responseText);
            init_repo_menu(response, user_id, chartobj_rating, chartobj_necessity, chartobj_review_time, datatable_main);
        }
        else {
            // TODO: Display ERROR message as iziToast
        }


		// DATE & USER PROFILE INIT
        $('input[name="daterange"]').daterangepicker();
        $('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
        	isRanged = true;
        	range_start_date = picker.startDate.format('YYYY-MM-DD');
        	range_end_date = picker.endDate.format('YYYY-MM-DD');
            var user_id = getQueryVariable("userid");
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://chennai.ewi.tudelft.nl:60003/profile", false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                "action": "fetch_ranged",
                "user_id": user_id,
                "start_date": range_start_date,
                "end_date": range_end_date,
                "repo_name": current_repo
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

	});
	


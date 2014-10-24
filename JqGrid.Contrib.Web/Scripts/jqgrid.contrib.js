// events
$.ajaxSetup({
    cache: false
});

$(document).on("submit", ".gridFilterForm", function () {
    reloadFilters(this);
    return false;
});

$(document).on("reset", ".gridFilterForm", function () {
    resetFilter(this);
});

$(document).on("click", ".add-filter", function () {
    var option = $(this).next().find('select option:selected');
    var value = $(option).val();
    if (value != '-1') {
        var model = {
            type: $(option).data('type'),
            description: $(option).text().trim(),
            name: value,
            url: $(option).data('url')
        }

        $('.btn-filter').removeClass('hide');
        var innerForm = $(this).data("formid");
        var selector = '#' + innerForm + ' div:first';
        var html = createFilter(model);
        $(selector).prepend(html);

        prepareGridFilterDate();
        $(option).hide();
        $(this).next().find('select').val('-1');
    }
});

$(document).on('click', '.close-filter', function () {
    var value = $(this).data("value");
    var div = $(this).closest('div');
    var parentDiv = div.parent();

    $('.select-filter option[value=' + value + ']').show();
    resetFilter($(this).closest('form'));
    $(div).remove();

    if ($(parentDiv).find('.control-filter').length == 0) {
        $(parentDiv).find('.btn-filter').addClass('hide');
    }
});

$(".date-from").on("dp.change", function (e) {
    var to = $(this).data('date-to');
    $('#' + to).data("DateTimePicker").setMinDate(e.date);
});

$(".date-to").on("dp.change", function (e) {
    var from = $(this).data('date-from');
    $('#' + from).data("DateTimePicker").setMaxDate(e.date);
});


// responsive grids
$(window).bind('resize', function () {
    resizeAllGrids();
});

function resizeAllGrids(container) {
    $(container || document).find('.ui-jqgrid-btable').each(function (index, element) {
        var width = $(element).closest('.ui-jqgrid').parent().width();
        resizeGrid(element, width);
    });
}

function resizeGrid(grid, width) {
    $(grid).setGridWidth(width);
}


// grid data
function getDataGrid(ele) {
    var result = [];
    var dataGrid = $(ele).data("grid");
    if (dataGrid) {
        result = dataGrid.split(',');
    }

    return result;
}

function updateGridInfo(grid) {
    preparePager(grid);
    var $grid = $(grid);
    var id = $grid.attr("id");
    var totalRecords = $grid.jqGrid('getGridParam', 'records');
    var perpageRecords = $grid.jqGrid('getGridParam', 'rowNum');
    var actualPage = $grid.jqGrid('getGridParam', 'page');
    var actualRecords = $grid.jqGrid('getGridParam', 'reccount');
    var record1 = (totalRecords == 0) ? 0 : perpageRecords * (actualPage - 1) + 1;
    var record2 = perpageRecords * (actualPage - 1) + actualRecords;
    var sep = " " + "de" + " ";
    $(".lblInfo[grid='" + id + "']").html("(" + record1 + " - " + record2 + sep + totalRecords + ")");
    if (actualPage < $grid.jqGrid('getGridParam', 'lastpage')) {
        $(".btnNext[grid='" + id + "']").removeClass("disabled");
        $(".btnEnd[grid='" + id + "']").removeClass("disabled");
    }
    else {
        $(".btnNext[grid='" + id + "']").addClass("disabled");
        $(".btnEnd[grid='" + id + "']").addClass("disabled");
    }
    if (actualPage > 1) {
        $(".btnPrev[grid='" + id + "']").removeClass("disabled");
        $(".btnHome[grid='" + id + "']").removeClass("disabled");
    }
    else {
        $(".btnPrev[grid='" + id + "']").addClass("disabled");
        $(".btnHome[grid='" + id + "']").addClass("disabled");
    }
}

function gridLoadComplete(grid) {
    var $grid = $(grid);
    var $selector = $(".emptyMsgDiv", $grid.closest(".ui-jqgrid").parent());
    $selector.html($grid.jqGrid('getGridParam', 'emptyrecords'));
    if (grid.p.reccount === 0) {
        $grid.hide();
        $selector.show();
    } else {
        $grid.show();
        $selector.hide();
    }
}

function reloadGrid(grid, page) {
    $("#" + grid).trigger("reloadGrid", [{ page: page }]);
}


// pagination
function preparePager(gridp) {
    var id = $(gridp).attr("id");
    $(".btnNext[grid='" + id + "']").each(function (index, domEle) {
        // domEle == this
        var grid = $(domEle).attr("grid");
        $(domEle).on("click", function () {
            var page = $("#" + grid).jqGrid('getGridParam', 'page');
            var lastpage = $("#" + grid).jqGrid('getGridParam', 'lastpage');
            if (page < lastpage)
                reloadGrid(grid, page == lastpage ? page : page + 1);
        });
    });
    $(".btnPrev[grid='" + id + "']").each(function (index, domEle) {
        // domEle == this
        var grid = $(domEle).attr("grid");
        $(domEle).on("click", function () {
            var page = $("#" + grid).jqGrid('getGridParam', 'page');
            if (page > 1)
                reloadGrid(grid, page == 1 ? page : page - 1);
        });
    });
    $(".btnHome[grid='" + id + "']").each(function (index, domEle) {
        // domEle == this
        var grid = $(domEle).attr("grid");
        $(domEle).on("click", function () {
            var page = $("#" + grid).jqGrid('getGridParam', 'page');
            if (page > 1)
                reloadGrid(grid, 1);
        });
    });
    $(".btnEnd[grid='" + id + "']").each(function (index, domEle) {
        // domEle == this
        var grid = $(domEle).attr("grid");
        $(domEle).on("click", function () {
            var page = $("#" + grid).jqGrid('getGridParam', 'page');
            var lastpage = $("#" + grid).jqGrid('getGridParam', 'lastpage');
            if (page < lastpage)
                reloadGrid(grid, lastpage);
        });
    });
}


// Filters 
// example  rules = [{ Field: "accountname", Data: "7"},{ Field: "id", Data: "6"}];
// op = 0 --equal 1 --delete
function execFilter(idgrid, filterArray) {
    var filterJson = JSON.stringify(filterArray);
    var grid = $("#" + idgrid);
    var postdata = grid.jqGrid('getGridParam', 'postData');
    $.extend(postdata, {
        filters: filterJson
    });
    grid.jqGrid('setGridParam', { search: true, postData: postdata });
    reloadGrid(idgrid, 1);
}

function AddParanIdGrid(idgrid, value) {
    var grid = $("#" + idgrid);
    var postdata = grid.jqGrid('getGridParam', 'postData');
    $.extend(postdata, {
        IdFilter: value
    });

    grid.jqGrid('setGridParam', { postData: postdata });
}

function clearFilter(idgrid) {
    var grid = $("#" + idgrid);
    var postdata = grid.jqGrid('getGridParam', 'postData');
    $.extend(postdata, {
        filters: null
    });

    grid.jqGrid('setGridParam', { search: true, postData: postdata });

}

function createFilter(filter) {
    var container = '<div class="form-group col-md-4 control-filter">';
    var label = '<label class="control-label" for="id' + filter.name + '">' + filter.description + '</label>';
    var btnClose = '<button type="button" data-value="' + filter.name + '" class="close close-filter"><span aria-hidden="true">×</span><span class="sr-only">Cerrar</span></button>';
    var componen = '';
    switch (filter.type) {
        case 1://textbox
            componen = '<input type="text" placeholder="' + filter.description + '" name="' + filter.name + '" id="id' + filter.name + '" class="form-control text-uppercase">';
            break;
        case 2://select
            componen = '<select name="' + filter.name + '" id="id' + filter.name + '" class="form-control"><option value="">-- Seleccionar --</option></select>';
            loadSelect('id' + filter.name, filter.url);
            break;
        case 3://date
            componen = '<div class=""><div class="input-group date" id="txtDate" data-date-format="dd/MM/yyy">' +
                '<input type="text" id="id' + filter.name + '" name="' + filter.name + '" readonly="readonly" class="form-control" />' +
                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span></div></div>';
            break;
        case 4://date Range
            container = '<div class="form-group col-md-8 control-filter">' + '<label class="control-label col-md-11" for="id' + filter.name + '">' + filter.description + '</label>' + btnClose +
                '<div class="control-group">' +
                '<div class="col-md-6">' +
                '<label class="" for="idfrom' + filter.name + '">Desde</label>' +
                '<div data-date-format="dd/MM/yyyy" id="from" class="input-group date">' +
                '<input type="text" class="form-control" readonly="readonly" name="from' + filter.name + '" id="idfrom' + filter.name + '">' +
                '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                '</div></div>' +
                '<div class="col-md-6">' +
                '<label class=" " for="idto' + filter.name + '">Hasta</label>' +
                '<div data-date-format="dd/MM/yyyy" id="to" class="input-group date">' +
                '<input type="text" class="form-control" readonly="readonly" id="idTo' + filter.name + '" name="to' + filter.name + '">' +
                '<span class="input-group-addon">' +
                '<span class="fa-calendar fa"></span>' +
                '</span></div></div></div></div>';
            return container;
        default:

    }
    return container + label + btnClose + componen + '</div>';
}

function loadSelect(id, url) {
    if (url) {
        $.ajax({
            type: "get",
            url: url,
            success: function (d) {
                if (d.success) {
                    var select = $('#' + id);
                    var stringOptions = '';
                    for (var i = 0; i < d.values.length; i++) {
                        var item = d.values[i];
                        var option = '<option value="' + item.value + '">' + item.text + '</option>';
                        stringOptions += option;
                    }
                    $(select).append(stringOptions);
                } else {
                    toastr['error']("Al agregar el filtro el servidor dio un error inesperado , elimínelo y vuelva agregarlo por favor.");
                }
            },
            error: function (err) {
                toastr['error'](err);
            },
            dataType: 'json'
        });
    }
}

function getFilterArray(formId) {
    var form = $(formId);
    var arr = form.serializeArray();
    arr = $.grep(arr, function (n) {
        return (n.value.length > 0);
    });

    var prefix = form.data("prefix");
    if ($.trim(prefix).length) {
        prefix += ".";
    }
    var data = $.map(arr, function (o) { return { field: o.name.replace(prefix, ""), data: o.value }; });

    return { rules: data };
}

function reloadFilters(form) {
    var $form = $(form),
   data = getFilterArray($form),
   grids = getDataGrid($form);
    $.each(grids, function () {
        execFilter(this, data);
    });


};

function resetFilter(form) {
    var $form = $(form),
        grids = getDataGrid($form);
    $.each(grids, function () {
        clearFilter(this);
        reloadGrid(this, 1);
    });
}
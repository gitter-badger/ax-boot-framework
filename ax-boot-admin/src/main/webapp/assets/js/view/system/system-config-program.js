var fnObj = {};
var ACTIONS = axboot.actionExtend(fnObj, {
    PAGE_SEARCH: "PAGE_SEARCH",
    PAGE_SAVE: "PAGE_SAVE",
    ITEM_CLICK: "ITEM_CLICK",
    ITEM_ADD: "ITEM_ADD",
    ITEM_DEL: "ITEM_DEL",
    dispatch: function (caller, act, data) {
        var _this = this;
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                axboot.ajax({
                    type: "GET",
                    url: "/api/v1/programs",
                    data: this.searchView.getData()
                }, function (res) {
                    _this.gridView01.setData(res);
                }, {
                    onError: function (err) {
                        console.log(err);
                    }
                });
                break;
            case ACTIONS.ITEM_CLICK:

                break;
            case ACTIONS.ITEM_ADD:
                this.gridView01.addRow();
                break;
            case ACTIONS.ITEM_DEL:
                this.gridView01.delRow("selected");
                break;
            case ACTIONS.PAGE_SAVE:
                var saveList = [].concat(this.gridView01.getData("modified"));
                saveList = saveList.concat(this.gridView01.getData("deleted"));

                axboot.ajax({
                    type: "PUT",
                    url: "/api/v1/programs",
                    data: JSON.stringify(saveList)
                }, function (res) {
                    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                    axToast.push("저장 되었습니다");
                });
                break;
            case ACTIONS.FORM_CLEAR:
                var _this = this;
                axDialog.confirm({
                    msg: "정말 양식을 초기화 하시겠습니까?"
                }, function () {
                    if (this.key == "ok") {
                        _this.formView01.clear();
                    }
                });
                break;
            default:
                return false;
        }
        return false;
    }
});

// fnObj 기본 함수 스타트와 리사이즈
fnObj.pageStart = function () {
    this.pageButtonView.initView();
    this.searchView.initView();
    this.gridView01.initView();

    ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
};

fnObj.pageResize = function () {

};


fnObj.pageButtonView = axboot.viewExtend({
    initView: function () {
        var _this = this;
        $('[data-page-btn]').click(function () {
            _this.onClick(this.getAttribute("data-page-btn"));
        });
    },
    onClick: function (_act) {
        var _root = fnObj;
        switch (_act) {
            case "search":
                ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
                break;
            case "save":
                ACTIONS.dispatch(ACTIONS.PAGE_SAVE);
                break;
            case "excel":
                break;
            case "fn1":
                break;
            case "fn2":
                break;
            case "fn3":
                break;
            case "fn4":
                break;
            case "fn5":
                break;
        }
    }
});

//== view 시작
/**
 * searchView
 */
fnObj.searchView = axboot.viewExtend(axboot.searchView, {
    initView: function () {
        this.target = $(document["searchView0"]);
        this.target.attr("onsubmit", "return ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);");
        this.filter = $("#filter");
    },
    getData: function () {
        return {
            pageNumber: 0,
            pageSize: 99999,
            filter: this.filter.val()
        }
    }
});


/**
 * gridView
 */
fnObj.gridView01 = axboot.viewExtend(axboot.gridView, {
    initView: function () {
        var _this = this;

        $('[data-grid-view-01-btn]').click(function () {
            var _act = this.getAttribute("data-grid-view-01-btn");
            switch (_act) {
                case "add":
                    ACTIONS.dispatch(ACTIONS.ITEM_ADD);
                    break;
                case "delete":
                    ACTIONS.dispatch(ACTIONS.ITEM_DEL);
                    break;
            }
        });

        this.target = axboot.gridBuilder({
            showRowSelector: true,
            frozenColumnIndex: 2,
            target: $('[data-ax5grid="grid-view-01"]'),
            columns: [
                {key: "progNm", label: "프로그램명", width: 160, align: "left", editor: "text"},
                {key: "progPh", label: "경로", width: 350, align: "left", editor: "text"},
                {key: "authCheck", label: "권한체크여부", width: 80, align: "center", editor: "checkYn"},
                {key: "schAh", label: "조회", width: 50, align: "center", editor: "checkYn"},
                {key: "savAh", label: "저장", width: 50, align: "center", editor: "checkYn"},
                {key: "exlAh", label: "엑셀", width: 50, align: "center", editor: "checkYn"},
                {key: "delAh", label: "삭제", width: 50, align: "center", editor: "checkYn"},
                {key: "fn1Ah", label: "FN1", width: 50, align: "center", editor: "checkYn"},
                {key: "fn2Ah", label: "FN2", width: 50, align: "center", editor: "checkYn"},
                {key: "fn3Ah", label: "FN3", width: 50, align: "center", editor: "checkYn"},
                {key: "fn4Ah", label: "FN4", width: 50, align: "center", editor: "checkYn"},
                {key: "fn5Ah", label: "FN5", width: 50, align: "center", editor: "checkYn"},
                {key: "remark", label: "설명", width: 300, editor: "text"}
            ],
            body: {
                onClick: function () {
                    // this.self.select(this.dindex);
                }
            }
        });
    },
    getData: function (_type) {
        var list = [];
        var _list = this.target.getList(_type);

        if (_type == "modified" || _type == "deleted") {
            list = ax5.util.filter(_list, function () {
                return this.progNm && this.progPh;
            });
        } else {
            list = _list;
        }
        return list;
    },
    addRow: function () {
        this.target.addRow({__created__: true, useYn: "N", authCheck: "N"}, "last");
    }
});
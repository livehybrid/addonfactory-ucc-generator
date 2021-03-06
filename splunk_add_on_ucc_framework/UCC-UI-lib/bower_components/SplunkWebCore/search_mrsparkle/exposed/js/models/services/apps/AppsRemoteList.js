define(
    [
        'models/SplunkDBase'
    ],
    function(
        BaseModel
    ) {
        return BaseModel.extend({
            url: 'apps/remote/list',
            parse: function(response, options) {
                this.entry.content.set({apps: response.apps});
                this.paging = {"total":response.total,"perPage":response.last,"offset":response.first};
            }
        });
    }
);

define(
    [
        'jquery',
        'underscore',
        'module',
        'views/shared/Modal',
        'splunk.util'
    ],
    function(
        $,
        _,
        module,
        Modal,
        splunkUtil
    ) {
        return Modal.extend({
            moduleId: module.id,
            
            initialize: function() {
                Modal.prototype.initialize.apply(this, arguments);

                this.on('hidden', function() {
                    this.accepted ? this.trigger('accepted') : this.trigger('declined');
                }.bind(this));
            },

            events: $.extend({}, Modal.prototype.events, {
                'click .modal-btn-primary': function(e) {
                    e.preventDefault();
                    this.accepted = true;
                }
            }),
            
            render: function() {
                this.$el.html(Modal.TEMPLATE);
                // Remove the header
                this.$(Modal.HEADER_SELECTOR).html('');
                this.$(Modal.BODY_SELECTOR).append(_.template(this.bodyTemplate, {
                    fieldNames: this.options.fields,
                    isCommandRemoval: this.options.isCommandRemoval,
                    sprintf: splunkUtil.sprintf,
                    _: _
                }));
                this.$(Modal.FOOTER_SELECTOR).append(this.compiledTemplate());

                return this;
            },
            
            template: '' +
                '<a href="#" class="btn btn-primary modal-btn-primary pull-right" data-dismiss="modal">' + _('OK').t() + '</a>' +
                '<a href="#" class="btn cancel modal-btn-cancel pull-left" data-dismiss="modal">' + _('Cancel').t() + '</a>',
            
            bodyTemplate: '' +
                '<% if (fieldNames.length === 1) { %>' +
                    '<% if (isCommandRemoval) { %>' +
                        '<span><%= sprintf(_("The field %s generated by this command is required by one or more subsequent commands. Are you sure you want to remove the command and the field?").t(), "<i>" + _.escape(fieldNames[0]) + "</i>") %></span>' +
                    '<% } else { %>' +
                        '<span><%= sprintf(_("The field %s is required by one or more commands. Are you sure you want to remove the field?").t(), "<i>" + _.escape(fieldNames[0]) + "</i>") %></span>' +
                    '<% } %>' +
                '<% } else { %>' +
                    '<% if (isCommandRemoval) { %>' +
                        '<span><%= _("The following fields generated by this command are required by one or more subsequent commands:").t() %></span>' +
                    '<% } else { %>' +
                        '<span><%= _("The following fields are required by one or more commands:").t() %></span>' +
                    '<% } %>' +
                    '<ul>' +
                        '<% _.each(fieldNames, function(fieldName) { %>' +
                            '<li><i><%- fieldName %></i></li>' +
                        '<% }) %>' +
                    '</ul>' +
                    '<span><%= _("Are you sure you want to remove the fields?").t() %></span>' +
                '<% } %>'
        });
    }
);

define(['jquery', 'underscore', 'twigjs'], function ($, _, Twig) {
  var CustomWidget = function () {
    var self = this;

    this.getTemplate = _.bind(function (template, params, callback) {
      params = (typeof params == 'object') ? params : {};
      template = template || '';

      return this.render({
        href: '/templates/' + template + '.twig',
        base_path: this.params.path,
        v: this.get_version(),
        load: callback
      }, params);
    }, this);

    this.callbacks = {
      render: function () {
        console.log('render');
        return true;
      },
      init: _.bind(function () {
        console.log('init');

        let settings = self.get_settings()

        AMOCRM.addNotificationCallback(self.get_settings().widget_code, function (data) {
          console.log(data)
        });

        console.log(settings)

        let modalHeight, modalWidth, modalMarginTop, modalMarginLeft

        if (settings.modalWidth === undefined || settings.modalWidth == "") {
          modalWidth = "1200"
          modalMarginLeft = "600"
        } else {
          modalWidth = settings.modalWidth
          modalMarginLeft = parseInt(settings.modalWidth) / 2
        }

        if (settings.modalHeight === undefined || settings.modalHeight == "") {
          modalHeight = "800"
          modalMarginTop = "400"
        } else {
          modalHeight = settings.modalHeight
          modalMarginTop = parseInt(settings.modalHeight) / 2
        }

        var iframe = `
        <iframe src="`+settings.siteLink+`?`+settings.getParam+`=`+AMOCRM.data.current_card.id+`"></iframe>
        `
        $('body').prepend('<div id="iframe_modal">'+iframe+'</div>')

        $('#iframe_modal').append('<span>X</span>')

        $('.card-fields__fields-block').append('<button id="link2site">'+settings.buttonText+'</button>')

        $('#link2site').css({
          backgroundColor: "#2da9d7",
          color: "#fff",
          margin: "0px 30px",
          display: "block",
          padding: "10px 50px",
          borderRadius: "3px",
          marginBottom: "20px",
          cursor: "pointer"
        })

        $('#iframe_modal').css({
          display: "none",
          height: modalHeight+"px",
          width: modalWidth+"px",
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: "99",
          marginLeft: "-"+modalMarginLeft+"px",
          marginTop: "-"+modalMarginTop+"px",
          border: "8px solid #162b3a"
        })

        $('#iframe_modal iframe').css({
          width: '100%',
          height: '100%'
        })

        $('#iframe_modal span').css({
          display: "block",
          backgroundColor: "#203d49",
          position: "absolute",
          top: "-30px",
          right: "-30px",
          fontSize: "20px",
          fontWeight: "bold",
          padding: "9px 15px",
          cursor: "pointer",
          color: "#fff"
        })

        $('#iframe_modal span').click(function(){
          $('#iframe_modal').hide()
        })

        $('#link2site').click(function(){
          $('#iframe_modal').show()
        })

        return true;
      }, this),
      bind_actions: function () {
        console.log('bind_actions');
        return true;
      },
      settings: function () {
        return true;
      },
      onSave: function () {
        // alert('скрипт то работает нахрен юноублин!');
        return true;
      },
      destroy: function () {

      },
      contacts: {
        //select contacts in list and clicked on widget name
        selected: function () {
          console.log('contacts');
        }
      },
      leads: {
        //select leads in list and clicked on widget name
        selected: function () {
          console.log('leads');
          alert('we are here')
        }
      },
      tasks: {
        //select taks in list and clicked on widget name
        selected: function () {
          console.log('tasks');
        }
      },
      advancedSettings: _.bind(function () {
        var $work_area = $('#work-area-' + self.get_settings().widget_code),
          $save_button = $(
            Twig({ref: '/tmpl/controls/button.twig'}).render({
              text: 'Сохранить',
              class_name: 'button-input_blue button-input-disabled js-button-save-' + self.get_settings().widget_code,
              additional_data: ''
            })
          ),
          $cancel_button = $(
            Twig({ref: '/tmpl/controls/cancel_button.twig'}).render({
              text: 'Отмена',
              class_name: 'button-input-disabled js-button-cancel-' + self.get_settings().widget_code,
              additional_data: ''
            })
          );

        console.log('advancedSettings');

        $save_button.prop('disabled', true);
        $('.content__top__preset').css({float: 'left'});

        $('.list__body-right__top').css({display: 'block'})
          .append('<div class="list__body-right__top__buttons"></div>');
        $('.list__body-right__top__buttons').css({float: 'right'})
          .append($cancel_button)
          .append($save_button);

        self.getTemplate('advanced_settings', {}, function (template) {
          var $page = $(
            template.render({title: self.i18n('advanced').title, widget_code: self.get_settings().widget_code})
          );

          $work_area.append($page);
        });
      }, self),

      /**
       * Метод срабатывает, когда пользователь в конструкторе Salesbot размещает один из хендлеров виджета.
       * Мы должны вернуть JSON код salesbot'а
       *
       * @param handler_code - Код хендлера, который мы предоставляем. Описан в manifest.json, в примере равен handler_code
       * @param params - Передаются настройки виджета. Формат такой:
       * {
       *   button_title: "TEST",
       *   button_caption: "TEST",
       *   text: "{{lead.cf.10929}}",
       *   number: "{{lead.price}}",
       *   url: "{{contact.cf.10368}}"
       * }
       *
       * @return {{}}
       */
      onSalesbotDesignerSave: function (handler_code, params) {
        var salesbot_source = {
            question: [],
            require: []
          },
          button_caption = params.button_caption || "",
          button_title = params.button_title || "",
          text = params.text || "",
          number = params.number || 0,
          handler_template = {
            handler: "show",
            params: {
              type: "buttons",
              value: text + ' ' + number,
              buttons: [
                button_title + ' ' + button_caption,
              ]
            }
          };

        console.log(params);

        salesbot_source.question.push(handler_template);

        return JSON.stringify([salesbot_source]);
      },
    };
    return this;
  };

  return CustomWidget;
});
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

        AMOCRM.addNotificationCallback(self.get_settings().widget_code, function (data) {
          console.log(data)
        });

        alert(AMOCRM.data.current_card.id);
        var iframe = `
          <iframe src="https://game2day.ru/test.php?LEAD_ID=`+AMOCRM.data.current_card.id+`"></iframe>
        `
        $('body').prepend('<div id="iframe_modal">'+iframe+'</div>')
        $('#iframe_modal').append('<span>X</span>')

        // $('#iframe_modal').css({
        //   display: "block",
        //   height: "800px",
        //   width: "1200px",
        //   position: "absolute",
        //   zIndex: "999999999999",
        //   left: "50%",
        //   marginLeft: "-600px",
        //   top: "50%",
        //   marginTop: "400%",
        //   width: "100%",
        //   height: "100%"
        // })
        $('#iframe_modal').css('display', 'block')
        $('#iframe_modal').css('height', '800px')
        $('#iframe_modal').css('width', '1200px')
        $('#iframe_modal').css('position', 'absolute')
        $('#iframe_modal').css('z-index', '999999999999')
        $('#iframe_modal').css('left', '50%')
        $('#iframe_modal').css('margin-left', '-600px')
        $('#iframe_modal').css('top', '50%')
        $('#iframe_modal').css('margin-top', '-400px')
        $('#iframe_modal iframe').css('width', '100%')
        $('#iframe_modal iframe').css('height', '100%')

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

        // display: block;
        // position: absolute;
        // z-index: 9999999999999999;
        // /* width: 30px; */
        // /* height: 30px; */
        // background: red;
        // top: -30px;
        // right: -30px;
        // font-size: 20px;
        // font-weight: bold;
        // padding: 9px 15px;
        // cursor: pointer;
        // color: #fff;



        // var data = '<h1>Test</h1><p>Some text</p>';
        //         modal = new Modal({
        //             class_name: 'modal-window',
        //             init: function ($modal_body) {
        //                 var $this = $(this);
        //                 $modal_body
        //                     .trigger('modal:loaded') // запускает отображение модального окна
        //                     .html(data)
        //                     .trigger('modal:centrify')  // настраивает модальное окно
        //                     .append('');
        //             },
        //             destroy: function () {
        //             }
        //         });

        // this.add_action("phone", function (params) {
        //   /**
        //    * код взаимодействия с виджетом телефонии
        //    */
        //   console.log(params)
        // });

        // this.add_source("sms", function (params) {
        //   /**
        //    params - это объект в котором будут  необходимые параметры для отправки смс

        //    {
        //      "phone": 75555555555,   // телефон получателя
        //      "message": "sms text",  // сообщение для отправки
        //      "contact_id": 12345     // идентификатор контакта, к которому привязан номер телефона
        //   }
        //    */

        //   return new Promise(_.bind(function (resolve, reject) {
        //       // тут будет описываться логика для отправки смс
        //       self.crm_post(
        //         'https://example.com/',
        //         params,
        //         function (msg) {
        //           console.log(msg);
        //           resolve();
        //         },
        //         'text'
        //       );
        //     }, this)
        //   );
        // });

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
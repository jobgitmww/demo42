(function () {
    var Message;
    var context;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage, context;

        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text, message_side) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }

            addMessage(text, 'right');

            $.post('/conversation', {message: text, context: context})
            .done((data)=>{
                context = data.context;
                addMessage(data.output.text, 'left');
            });
        };
        addMessage = function (text, message_side) {
            $('.message_input').val('');
            $messages = $('.messages');
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        }
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });
        $('.reload').click(function (e) {
            location.reload();
        })

        // call for initial Message
        $.post('/conversation', {message: " ", context: {}} )
        .done((data)=>{
            context = data.context;
            addMessage(data.output.text, 'left');
        });

    });
}.call(this));
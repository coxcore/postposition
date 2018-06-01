function initDemo($, postposition) {
    var $textSize = $('<span id="text-size" />').appendTo('body');
    var checkSize = function(str) {
        var result = str
            .replace(/<|>/g, '&lt;')
            .replace(/\s/g, '&nbsp;');

        return $textSize.html(result).width() + 10;
    };

    var getParam = function($params) {
        var result = [];

        $params.each(function(index, target) {
            result.push($(target).val());
        });

        return result;
    };

    $('body')
        .on('input.sample blur.sample change.sample', 'input[data-autosize]', function(event) {
            var $target = $(event.currentTarget);
            var value = $target.val();

            $target.css('width', checkSize(value));
        })
        .on('focus.sample', 'input[data-autosize]', function(event) {
            $(event.currentTarget).select();
        });

    $('[data-example]')
        .on('input.sample blur.sample change.sample', 'input[data-param]', function(event) {
            var $target = $(event.currentTarget);
            var $wrap = $target.closest('[data-example]');
            var $params = $('[data-param]', $wrap);
            var fn = postposition[$wrap.attr('data-example')];
            var result = (typeof fn === 'function') ? fn.apply(null, getParam($params)) : '';

            $('[data-result]', $wrap).text(String(result) || '');
        })
        .on('input.sample blur.sample change.sample', 'input[data-fix-param]', function(event) {
            var $target = $(event.currentTarget);
            var $wrap = $target.closest('[data-example]');
            var $params = $('[data-fix-param]', $wrap);
            var fnName = $wrap.attr('data-example');

            postposition[fnName] = postposition.fix.apply(null, getParam($params));

            $('[data-param]:first', $wrap).change();
        });

    $('input[data-fix-param], input[data-param]').change();
}

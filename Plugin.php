<?php
/**
 * 一个简易的 xiaxue 插件
 *
 * @package SnowControl
 * @author Li Yuyu
 * @version 1.0
 * @link https://blog.kokowo.cn/
 */
if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

class SnowControl_Plugin implements Typecho_Plugin_Interface
{
    private const VERSION = '1.0.0';

    public static function activate()
    {
        Typecho_Plugin::factory('Widget_Archive')->footer = [__CLASS__, 'render'];
        return _t('雪花插件已激活，可直接在“插件 → SnowControl”里配置。');
    }

    public static function deactivate()
    {
    }

    public static function config(Typecho_Widget_Helper_Form $form)
    {
        self::buildForm($form);
    }

    public static function personalConfig(Typecho_Widget_Helper_Form $form)
    {
    }

    private static function buildForm(Typecho_Widget_Helper_Form $form)
    {
        $enabled = new Typecho_Widget_Helper_Form_Element_Radio('enabled', [
            '1' => _t('开启'),
            '0' => _t('关闭'),
        ], '1', _t('开关'), _t('关闭后雪花效果不会在前台渲染。'));
        $form->addInput($enabled);

        $density = new Typecho_Widget_Helper_Form_Element_Text('density', null, '66', _t('雪花数量'), _t('控制雪花数量，建议范围 10-300，值越大越密集。'));
        $density->input->setAttribute('type', 'number');
        $density->input->setAttribute('min', '10');
        $density->input->setAttribute('max', '300');
        $density->addRule('isInteger', _t('请输入整数。'));
        $form->addInput($density);
    }

    public static function render()
    {
        $options = Helper::options()->plugin('SnowControl');
        if (empty($options->enabled) || '1' !== $options->enabled) {
            return;
        }

        $density = isset($options->density) ? (int) $options->density : 66;
        $density = max(10, min(300, $density));
        $scriptUrl = Typecho_Common::url('SnowControl/assets/snow.js?v=' . self::VERSION, Helper::options()->pluginUrl);
        echo '<script>(function(w){w.SnowControlConfig=w.SnowControlConfig||{};w.SnowControlConfig.density=' . $density . ';})(window);</script>';
        echo '<script src="' . htmlspecialchars($scriptUrl) . '" defer></script>';
    }
}

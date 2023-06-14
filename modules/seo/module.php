<?php
namespace Elementor\Modules\Seo;

use Elementor\Core\Base\Module as BaseModule;
use Elementor\Core\Common\Modules\Connect\Module as ConnectModule;
use Elementor\Modules\Ai\Connect\Ai;
use Elementor\Plugin;
use Elementor\User;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
class Module extends BaseModule {

	public function get_name() {
		return 'seo';
	}

	public function __construct() {
		parent::__construct();

		//add_action( 'elementor/connect/apps/register', function ( ConnectModule $connect_module ) {
		//	$connect_module->register_app( 'ai', Ai::get_class_name() );
		//} );

		add_action( 'elementor/editor/before_enqueue_scripts', function() {
			wp_enqueue_script(
				'elementor-seo',
				$this->get_js_assets_url( 'seo' ),
				[
					//'elementor-common',
					//'elementor-editor-modules',
					//'elementor-editor-document',
					//'elementor-packages-ui',
					//'elementor-packages-icons',
				],
				ELEMENTOR_VERSION,
				true
			);

			//wp_localize_script(
			//	'elementor-ai',
			//	'ElementorAiConfig',
			//	[
			//		'is_get_started' => User::get_introduction_meta( 'ai_get_started' ),
			//	]
			//);
		} );

		//add_action( 'elementor/editor/after_enqueue_styles', function() {
		//	wp_enqueue_style(
		//		'elementor-ai',
		//		$this->get_css_assets_url( 'modules/ai/editor' ),
		//		[],
		//		ELEMENTOR_VERSION
		//	);
		//} );
	}
}

<?php
namespace Elementor\Modules\Seo;

use Elementor\Core\Base\Module as BaseModule;
use Elementor\Core\Common\Modules\Connect\Module as ConnectModule;
use Elementor\Modules\Seo\Api\OpenAI;
use Elementor\Plugin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
class Module extends BaseModule {

	/**
	 * @return string
	 */
	public function get_name() {
		return 'seo';
	}

	public function __construct() {
		parent::__construct();

		add_action( 'elementor/connect/apps/register', function ( ConnectModule $connect_module ) {
			$connect_module->register_app( 'open-ai', OpenAI::get_class_name() );
		} );

		add_action( 'elementor/ajax/register_actions', function( $ajax ) {
			$ajax->register_ajax_action( 'seo_get_focus_keywords', [ $this, 'ajax_seo_get_focus_keywords' ] );
		} );

		add_action( 'elementor/editor/before_enqueue_scripts', function() {
			wp_enqueue_script( 'elementor-seo', $this->get_js_assets_url( 'seo' ), [], ELEMENTOR_VERSION, true );
		} );
	}

	private function get_open_ai_client(): OpenAI {
		return Plugin::$instance->common->get_component( 'connect' )->get_app( 'open-ai' );
	}

	/**
	 * @throws \Exception
	 */
	public function ajax_seo_get_focus_keywords( array $data ): array {
		$this->verify_permissions( $data['editor_post_id'] );

		$app = $this->get_open_ai_client();

		$content = get_the_content( null, false, $data['editor_post_id'] );
		$content = $this->get_clean_html( $content );

		return $app->get_focus_keywords( $content );
	}

	/**
	 * @param $editor_post_id
	 *
	 * @throws \Exception
	 */
	private function verify_permissions( $editor_post_id ) {
		$document = Plugin::$instance->documents->get( $editor_post_id );

		if ( ! $document ) {
			throw new \Exception( 'Document not found' );
		}

		if ( ! $document->is_built_with_elementor() || ! $document->is_editable_by_current_user() ) {
			throw new \Exception( 'Access denied' );
		}
	}

	/**
	 * WIP
	 *
	 * @param string $html
	 *
	 * @return string
	 */
	private function get_clean_html( string $html ): string {
		$doc = new \DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $html );
		libxml_clear_errors();
		$xpath = new \DOMXPath( $doc );

		foreach ( $xpath->query( '//script | //link | //form | //meta | //style | //noscript | //svg | //button' ) as $node ) {
			$node->parentNode->removeChild( $node );
		}

		foreach ( $xpath->query( '//@*' ) as $node) {
			$node->parentNode->removeAttribute( $node->nodeName );
		}

		foreach( $xpath->query( '//*[not(node())]' ) as $node ) {
			$node->parentNode->removeChild( $node );
		}

		return (string) $doc->saveHTML();
	}
}

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
			$ajax->register_ajax_action( 'seo_is_keyword_in_url', [ $this, 'ajax_seo_is_keyword_in_url' ] );
			$ajax->register_ajax_action( 'seo_is_keyword_in_title', [ $this, 'ajax_seo_is_keyword_in_title' ] );
			$ajax->register_ajax_action( 'seo_is_keyword_in_heading', [ $this, 'ajax_seo_is_keyword_in_heading' ] );
			$ajax->register_ajax_action( 'seo_is_keyword_in_subheadings', [ $this, 'ajax_seo_is_keyword_in_subheadings' ] );
			$ajax->register_ajax_action( 'seo_is_keyword_in_description', [ $this, 'ajax_seo_is_keyword_in_description' ] );

			// Keyword found in title
			// Keyword found in URL
			// Keyword found in heading
			// Keyword found in description
			// Keyword found in subheadings
			// @todo: count words >= 600
		} );

		add_action( 'elementor/editor/before_enqueue_scripts', function() {
			wp_enqueue_script( 'elementor-seo', $this->get_js_assets_url( 'seo' ), [], ELEMENTOR_VERSION, true );
		} );
	}

	/**
	 * @return OpenAI
	 */
	private function get_open_ai_client(): OpenAI {
		return Plugin::$instance->common->get_component( 'connect' )->get_app( 'open-ai' );
	}

	/**
	 * @throws \Exception
	 */
	public function ajax_seo_get_focus_keywords( array $data ): array {
		$this->verify_permissions( $data['editor_post_id'] );

		$app = $this->get_open_ai_client();

		$url = get_the_permalink( $data['editor_post_id'] );
		$html = $this->clean_html( file_get_contents( $url ) );

		return $app->get_focus_keywords( $html );
	}

	/**
	 * @param array $data
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function ajax_seo_is_keyword_in_title( array $data ): array {
		$this->verify_permissions( $data['editor_post_id'] );

		$html = $this->get_html_from_post_id( $data['editor_post_id'] );
		$title = $this->get_title_from_html( $html );
		$pass = false !== strpos( $title, $data['keyword'] );

		if ( ! $pass ) {
			$app = $this->get_open_ai_client();
			$suggestion = $app->suggest_page_title( $data['keyword'], $this->clean_html( $html ) );
		}

		return [
			'pass' => $pass,
			'suggestion' => $suggestion ?? null,
		];
	}

	/**
	 * @param array $data
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function ajax_seo_is_keyword_in_heading( array $data ): array {
		$this->verify_permissions( $data['editor_post_id'] );

		$html = $this->get_html_from_post_id( $data['editor_post_id'] );
		$heading = $this->get_heading_from_html( $html );
		$pass = false !== strpos( $heading, $data['keyword'] );

		if ( ! $pass ) {
			$app = $this->get_open_ai_client();
			$suggestion = $app->suggest_h1_title( $data['keyword'], $this->clean_html( $html ) );
		}

		return [
			'pass' => $pass,
			'suggestion' => $suggestion ?? null,
		];
	}

	/**
	 * @param array $data
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function ajax_seo_is_keyword_in_subheadings( array $data ): array {
		$this->verify_permissions( $data['editor_post_id'] );

		$html = $this->get_html_from_post_id( $data['editor_post_id'] );
		$subheadings = $this->get_subheadings_from_html( $html );

		$pass = false;
		foreach ( $subheadings as $subheading ) {
			if ( false !== strpos( $subheading, $data['keyword'] ) ) {
				$pass = true;
				break;
			}
		}

		return [
			'pass' => $pass,
		];
	}

	/**
	 * @param array $data
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function ajax_seo_is_keyword_in_description( array $data ): array {
		$this->verify_permissions( $data['editor_post_id'] );

		$html = $this->get_html_from_post_id( $data['editor_post_id'] );
		$excerpt = get_the_excerpt( $data['editor_post_id'] );
		$pass = false !== strpos( $excerpt, $data['keyword'] );

		if ( ! $pass ) {
			$app = $this->get_open_ai_client();
			$suggestion = $app->suggest_page_description( $data['keyword'], $this->clean_html( $html ) );
		}

		return [
			'pass' => $pass,
			'suggestion' => $suggestion ?? null,
		];
	}

	/**
	 * @param array $data
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function ajax_seo_is_keyword_in_url( array $data ): array {
		$this->verify_permissions( $data['editor_post_id'] );

		$url = get_permalink( $data['editor_post_id'] );
		$pass = false !== strpos( $url, $data['keyword'] );

		return [
			'pass' => $pass,
		];
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
	 * @param int $post_id
	 *
	 * @return string
	 */
	private function get_html_from_post_id( int $post_id ): string {
		$url = get_the_permalink( $post_id );

		return file_get_contents( $url );
	}

	/**
	 * WIP
	 *
	 * @param string $html
	 *
	 * @return string
	 */
	private function clean_html( string $html ): string {
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

		$html = $doc->saveHTML();
		$html = html_entity_decode( $html );
		$html = htmlspecialchars_decode($html);
		$html = strip_tags( $html );
		$html = preg_replace( '/\s\s+/', ' ', $html );

		return (string) $html;
	}

	/**
	 * @param string $html
	 *
	 * @return string|null
	 */
	private function get_title_from_html( string $html ): ?string {
		$doc = new \DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $html );
		libxml_clear_errors();

		$nodes = $doc->getElementsByTagName( 'title' );

		return $nodes->length > 0 ? $nodes->item( 0 )->textContent : null;
	}

	/**
	 * @param string $html
	 *
	 * @return string|null
	 */
	private function get_heading_from_html( string $html ): ?string {
		$doc = new \DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $html );
		libxml_clear_errors();

		$nodes = $doc->getElementsByTagName( 'h1' );

		return $nodes->length > 0 ? $nodes->item( 0 )->textContent : null;
	}

	/**
	 * @param string $html
	 *
	 * @return array
	 */
	private function get_subheadings_from_html( string $html ): array {
		$doc = new \DOMDocument();
		libxml_use_internal_errors( true );
		$doc->loadHTML( $html );
		libxml_clear_errors();

		$subheadings = [];
		foreach ( $doc->getElementsByTagName( 'h2' ) as $node ) {
			$subheadings[] = $node->textContent;
		}

		return $subheadings;
	}
}

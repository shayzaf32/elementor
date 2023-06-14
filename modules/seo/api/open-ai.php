<?php
namespace Elementor\Modules\Seo\Api;

use Elementor\Core\Common\Modules\Connect\Apps\Base_App;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class OpenAI extends Base_App {

	const API_URL = 'https://api.openai.com/v1/';
	const MODEL = 'gpt-3.5-turbo';
	const ROLE = 'user';

	/**
	 * @return string
	 */
	protected function get_api_url(): string {
		return static::API_URL;
	}

	/**
	 * @return string|null
	 */
	protected function get_api_token(): ?string {
		return defined( 'ELEMENTOR_OPEN_AI_TOKEN' ) ? ELEMENTOR_OPEN_AI_TOKEN : null;
	}

	/**
	 * @param string $content
	 * @param int $limit
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function get_focus_keywords( string $content, int $limit = 3 ): array {
		$prompt = "Generate {$limit} SEO relevant focus keywords based on the HTML document below,";
		$prompt .= " and reply your answer only in a JSON object with a key named keywords: ";
		$prompt .= $content;

		$response = $this->completion_request( $prompt);

		return [
			'keywords' => json_decode( $response['choices'][0]['message']['content'] )->keywords,
		];
	}

	/**
	 * @param string $prompt
	 *
	 * @return array
	 * @throws \Exception
	 */
	public function completion_request( string $prompt ): array {
		$response = $this->http_request(
			'POST',
			'chat/completions',
			[
				'timeout' => 50,
				'headers' => [
					'Content-Type' => 'application/json',
					'Authorization' => 'Bearer ' . $this->get_api_token(),
				],
				'body' => json_encode( [
					'model' => self::MODEL,
					'messages' => [
						[
							'role' => self::ROLE,
							'content' => $prompt,
						],
					],
				] ),
			],
			[
				'return_type' => static::HTTP_RETURN_TYPE_ARRAY,
			]
		);

		if ( is_wp_error( $response ) ) {
			throw new \Exception( $response->get_error_message(), $response->get_error_code() );
		}

		return $response;
	}

	protected function get_slug() {
		// TODO: Implement get_slug() method.
	}

	protected function update_settings() {
		// TODO: Implement update_settings() method.
	}
}

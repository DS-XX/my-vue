const ModuleFederationPlugin = require('webpack').container
	.ModuleFederationPlugin;
const NormalModuleReplacementPlugin = require('webpack')
	.NormalModuleReplacementPlugin;
const deps = require('./package.json').dependencies;
module.exports = {
	publicPath: process.env.NODE_ENV !== 'production' ? '' : '/modules/business/',
	outputDir: 'dist',
	productionSourceMap: false,
	devServer: {
		hot: true,
		// disableHostCheck: true,
		port: 4001,
		// overlay: {
		// 	warnings: false,
		// 	errors: true,
		// },
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		proxy: {
			'/myself-axios': {
				pathRewrite: {
				  "^/myself-axios": ""
				},
				// target: "https://mtxtest.weioutech.com:4438/",
				// target: "http://192.168.10.91:8801/",
				target: "http://127.0.0.1:8082",
				// target: 'https://test.glxytech.com:32443/',
				// target: "https://www.glxytech.com/",
				ws: true,
				secure: false,
				changeOrigin: true,
			},
			'/deepexi-system-digital-retail-business-service': {
				// pathRewrite: {
				//   "^/glxytech-system-merchant": ""
				// },
				target: "https://mtxtest.weioutech.com:4438/",
				// target: 'https://test.glxytech.com:32443/',
				// target: "https://www.glxytech.com/",
				ws: true,
				secure: false,
				changeOrigin: true,
			},
			'/glxytech-sso-resource': {
				target: "https://mtxtest.weioutech.com:4438/",
				// target: "https://www.glxytech.com/",
				// target: 'https://test.glxytech.com:32443/',
				ws: true,
				secure: false,
				changeOrigin: true,
			},
			'/glxytech-system-excel': {
				target: "https://mtxtest.weioutech.com:4438/",
				// target: "https://www.glxytech.com/",
				// target: 'https://test.glxytech.com:32443/',
				ws: true,
				secure: false,
				changeOrigin: true,
			},
		},
	},
	lintOnSave: false,
	chainWebpack: (config) => {
		config.module
			.rule('xlsx')
			.test(/\.(xls|xlsx)$/)
			.use('url-loader');
	},
	// 自定义webpack配置
	configureWebpack: {
		resolve: {
			fallback: {
				stream: require.resolve('stream-browserify'),
			},
		},
		// output: {
		//   jsonpFunction: `webpackJsonp-chile-vue2`
		// },
		plugins: [
			new ModuleFederationPlugin({
				name: 'business-module',
				filename: 'remoteEntry.js',
				// remotes: {
				// 	// core: "core@http://localhost:9000/remoteEntry.js",
				// 	// other: "other@http://localhost:9001/remoteEntry.js",
				// 	merchantApi: process.env.merchantApi,
				// 	sharedPackage: process.env.sharedPackage,
				// 	mtxTheme: process.env.mtxTheme,
				// },
				// shared: {
				//   vue: {
				//     // eager: true,
				//     singleton: true,
				//     // requiredVersion: deps.vue,
				//   },
				// }
				// shared: require("./package.json").dependencies,
			}),
			new NormalModuleReplacementPlugin(/(.*)/, (resource) => {
				// 如果请求的 resource 是 react，则指向 app1/react
				// if (resource.request === 'vue-router') {
				// 	resource.request = 'sharedPackage/vue-router';
				// }
				// if (resource.request === 'axios') {
				// 	resource.request = 'sharedPackage/axios';
				// }
				// if (resource.request === 'mtxRequest') {
				// 	resource.request = 'merchantApi/request';
				// }
				// if (resource.request === 'mtxCommercialApi') {
				// 	resource.request = 'merchantApi/CommercialApi';
				// }
				// if (resource.request === 'mtxCommodityApi') {
				// 	resource.request = 'merchantApi/CommodityApi';
				// }
			}),
		],
		output: {
      filename: '[name].[contenthash:8].js',
			// 把子应用打包成 umd 库格式
			library: `${deps.name}-[name]`,
			libraryTarget: 'umd',
      chunkFilename: '[name].[chunkhash:8].js'
			// jsonpFunction: `webpackJsonp_${deps.name}`,
		},
		optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					javascriptEnabled: true,
				}, //less 配置
			},
		},
	},
};

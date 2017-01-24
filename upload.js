import React, { PropTypes } from 'react'

export default class Upload extends React.Component {
    // static propTyps = {
    //     uploadSrc: PropTypes.string.isRequired
    // }
    //
    // static defaultPropTypes = {
    //     uploadSrc: ''
    // }
    constructor(props) {
        super(props)
        this.drawCanvasImage = this.drawCanvasImage.bind(this)
        this.handleImgChange = this.handleImgChange.bind(this)
        this.readImage = this.readImage.bind(this)
        this.state = {
            uploadSrc: ''
        }
    }

    drawCanvasImage(image) {
        // 绘制图片
        let width = image.width
        let height = image.height
        // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        let ratio = width * height / 1000000
        if (ratio > 1) {
            ratio = Math.sqrt(ratio)
            width /= ratio
            height /= ratio
        } else {
            ratio = 1
        }

        function onloadCanvas() {
            // 用于压缩图片的canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            // 瓦片canvas
            const tCanvas = document.createElement('canvas')
            const tctx = tCanvas.getContext('2d')
            // canvas 清屏
            ctx.fillStyle = '#fff'
            ctx.clearRect(0, 0, canvas.width, canvas.height)
                // 重置canvas宽高
            canvas.width = width
            canvas.height = height
            // 绘制
            // 如果图片像素大于100万则使用瓦片绘制
            let count = width * height / 1000000
            if (count > 1) {
                // 计算要分成多少块瓦片
                count = ~~(Math.sqrt(count) + 1)
                // 计算每块瓦片的宽和高
                const nw = ~~(width / count)
                const nh = ~~(height / count)

                tCanvas.width = nw
                tCanvas.height = nh

                for (let i = 0; i < count; i++) {
                    for (let j = 0; j < count; j++) {
                        tctx.drawImage(image, i * nw * ratio, j * nh * ratio,
                            nw * ratio, nh * ratio, 0, 0, nw, nh)

                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
                    }
                }
            } else {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
            }
            const imgSrcData = canvas.toDataURL('image/jpg', 0.1)
            // tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
            this.setState({
    			uploadSrc: imgSrcData
    		})
        }
        onloadCanvas()
    }

    loadImage(src, onload) {
        const img = new Image()
        img.src = src
        img.onload = () => {
            onload(img)
        }
        img.onerror = () => {
            onload(false)
        }
    }

    readImage(src) {
		const that = this
		// 创建 FileReader 对象 并调用 render 函数来完成渲染
		// src.type
		const reader = new FileReader()
		reader.onload = function(e) {
			// that.drawImage(e.target.result)
			that.loadImage(e.target.result, that.drawCanvasImage)
		}
		// 读取文件内容
		reader.readAsDataURL(src)
	}

    handleImgChange(event) {
        this.readImage(event.target.files[0])
    }

    render() {
        return (
            <div className="upload-wrap">
                <input
    				type="file"
    				accept="image/png,image/jpeg,image/gif"
    				name="file"
    				onChange={this.handleImgChange}
    				className="upload-file-input"
    			/>
            </div>
        )
    }
}

from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import base64
from rembg import remove
import io
import os
import logging
from datetime import datetime
from PIL import Image

app = Flask(__name__)
CORS(app)  # 允许所有跨域请求

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/flask.log'),
        logging.StreamHandler()
    ]
)

# 确保目录存在
os.makedirs('uploads', exist_ok=True)
os.makedirs('processed', exist_ok=True)
os.makedirs('logs', exist_ok=True)

@app.route('/')
def home():
    return "背景移除服务已启动，请使用/remove-bg接口上传图片"

@app.route('/api/remove-bg', methods=['POST'])
def remove_background():
    # 同时支持'image'和'file'字段名
    file = request.files.get('image') or request.files.get('file')
    if not file:
        logging.error("400错误: 请求中未包含图片文件")
        logging.error(f"请求表单数据: {request.form}")
        logging.error(f"请求文件数据: {request.files}")
        return jsonify({"error": "未上传图片(请使用'image'或'file'字段名)"}), 400
    if file.filename == '':
        logging.error("400错误: 上传了空文件")
        return jsonify({"error": "空文件"}), 400
        
    # 检查文件类型
    allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
    if '.' not in file.filename or file.filename.split('.')[-1].lower() not in allowed_extensions:
        logging.error(f"400错误: 不支持的图片格式 {file.filename}")
        return jsonify({"error": "只支持PNG, JPG, JPEG, WEBP格式"}), 400
        
    try:
        # 保存原始文件用于调试
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        upload_path = f"uploads/{timestamp}_{file.filename}"
        file.save(upload_path)
        logging.info(f"图片已保存到: {upload_path}")
        
        # 读取图片
        with open(upload_path, 'rb') as f:
            input_image = Image.open(io.BytesIO(f.read()))
        
        logging.info("开始处理图片...")
        # 移除背景
        output_image = remove(input_image)
        logging.info("背景移除完成")
        
        # 保存处理后的图片
        output_path = f"processed/output_{timestamp}.png"
        output_image.save(output_path)
        logging.info(f"处理结果已保存到: {output_path}")
        
        # 返回结果
        if request.args.get('raw') == 'true':
            # 直接返回图片数据
            img_byte_arr = io.BytesIO()
            output_image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            return img_byte_arr.getvalue(), 200, {
                'Content-Type': 'image/png',
                'Content-Disposition': 'attachment; filename=output.png'
            }
        else:
            # 返回JSON格式
            # 验证图片数据
            img_byte_arr = io.BytesIO()
            output_image.save(img_byte_arr, format='PNG')
            img_bytes = img_byte_arr.getvalue()
            
            # 验证Base64编码
            try:
                img_base64 = base64.b64encode(img_bytes).decode('utf-8')
                # 测试解码
                decoded_img = base64.b64decode(img_base64)
                if len(decoded_img) != len(img_bytes):
                    raise ValueError("Base64解码后数据长度不匹配")
                
                logging.info(f"Base64编码验证成功，数据长度: {len(img_bytes)}字节")
            except Exception as e:
                logging.error(f"Base64编码验证失败: {str(e)}")
                raise
            
            response_data = {
                "status": "success",
                "message": "背景移除完成",
                "image_url": f"/processed/output_{timestamp}.png",
                "image_data": f"data:image/png;base64,{img_base64}",
                "download_url": f"/api/remove-bg?raw=true&timestamp={timestamp}"
            }
            print(f"返回数据: {response_data}")  # 调试日志
            return jsonify(response_data)
    except Exception as e:
        logging.error(f"处理图片时出错: {str(e)}", exc_info=True)
        return jsonify({"error": "处理图片时出错，请检查日志获取详细信息"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
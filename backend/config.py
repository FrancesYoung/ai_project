import os
from datetime import timedelta

class BaseConfig:
    """基础配置"""
    # Flask配置
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB最大文件大小

    # CORS配置
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']

    # 文件上传配置
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # 图片处理配置
    IMAGE_MAX_DIMENSION = 2000  # 最大图片尺寸
    JPEG_QUALITY = 85  # JPEG压缩质量
    PNG_COMPRESSION = 6  # PNG压缩级别(0-9)

    # 文件清理配置
    MAX_FILE_AGE = timedelta(hours=1).total_seconds()  # 临时文件最大保存时间
    CLEANUP_INTERVAL = 3600  # 清理间隔（秒）

class DevelopmentConfig(BaseConfig):
    """开发环境配置"""
    DEBUG = True
    TESTING = False

class TestingConfig(BaseConfig):
    """测试环境配置"""
    DEBUG = False
    TESTING = True
    MAX_FILE_AGE = timedelta(minutes=5).total_seconds()
    CLEANUP_INTERVAL = 300

class ProductionConfig(BaseConfig):
    """生产环境配置"""
    DEBUG = False
    TESTING = False
    CORS_ORIGINS = ['https://your-production-domain.com']  # 根据实际情况修改

def get_config():
    """根据环境变量返回相应的配置类"""
    env = os.environ.get('FLASK_ENV', 'development')
    configs = {
        'development': DevelopmentConfig,
        'testing': TestingConfig,
        'production': ProductionConfig
    }
    return configs.get(env, DevelopmentConfig)
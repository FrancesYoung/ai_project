import requests
import os
from PIL import Image

def test_remove_bg():
    # 准备测试图片路径
    test_image = os.path.join(os.path.dirname(__file__), 'test.jpg')
    
    if not os.path.exists(test_image):
        print(f"错误：测试图片 {test_image} 不存在")
        print("请在backend目录下放置名为test.jpg的测试图片")
        return False
    
    print(f"正在使用测试图片: {test_image}")
    
    try:
        # 调用API
        url = "http://localhost:5000/remove-bg"
        files = {'image': open(test_image, 'rb')}
        response = requests.post(url, files=files)
        
        # 检查响应
        if response.status_code == 200:
            output_image = os.path.join(os.path.dirname(__file__), 'output.png')
            with open(output_image, 'wb') as f:
                f.write(response.content)
            
            print(f"背景移除成功！结果已保存到: {output_image}")
            
            # 尝试显示图片（可选）
            try:
                img = Image.open(output_image)
                img.show()
            except:
                print("无法自动显示图片，请手动查看输出文件")
            
            return True
        else:
            print(f"请求失败，状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            return False
            
    except Exception as e:
        print(f"测试过程中发生错误: {str(e)}")
        return False

if __name__ == '__main__':
    if test_remove_bg():
        print("测试成功完成！")
    else:
        print("测试失败，请检查错误信息")
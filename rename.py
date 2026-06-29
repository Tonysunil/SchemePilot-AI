import os

dirs = [r"c:\Capstone Project\frontend\src", r"c:\Capstone Project\backend"]

for d in dirs:
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith(('.ts', '.tsx', '.py', '.md')):
                path = os.path.join(root, f)
                try:
                    with open(path, 'r', encoding='utf-8') as file:
                        content = file.read()
                    
                    if "JanMitra" in content or "janmitra" in content:
                        new_content = content.replace("JanMitra", "SchemePilot").replace("janmitra", "schemepilot")
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(new_content)
                        print(f"Updated {path}")
                except Exception as e:
                    print(f"Error on {path}: {e}")

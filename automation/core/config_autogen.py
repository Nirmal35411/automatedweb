import yaml, os

CONFIG_PATH = 'config/config.yaml'

def add_task(name, url, selector):
    with open(CONFIG_PATH) as f:
        cfg = yaml.safe_load(f)

    new_task = {
        'name': name,
        'steps': [
            {'action': 'open_tab', 'url': url},
            {'action': 'extract_data', 'selector': selector},
            {'action': 'save_state'}
        ]
    }

    cfg.setdefault('tasks', []).append(new_task)

    with open(CONFIG_PATH, 'w') as f:
        yaml.safe_dump(cfg, f)

    print(f'Task added successfully: {name}')

if __name__ == '__main__':
    name = input('Task name: ')
    url = input('URL to open: ')
    selector = input('CSS selector: ')
    add_task(name, url, selector)

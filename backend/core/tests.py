from utils.test import AppLiveServerTestCase

from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.webdriver import WebDriver
from selenium.webdriver.firefox.options import Options
from .models import Task
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")


class TaskTests(AppLiveServerTestCase):
    FRONTEND_URL = FRONTEND_URL
    port = 8000
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        options = Options()
        if os.environ.get('SELENIUM_HEADLESS') == 'True':
            options.add_argument('--headless')

        cls.selenium = WebDriver(options)
        cls.selenium.implicitly_wait(10)
        cls.selenium.set_window_size(1920, 1080)

    @classmethod
    def tearDownClass(cls):
        cls.selenium.quit()
        super().tearDownClass()

    def find_element(self, by, value, driver = None, timeout=10):
        return WebDriverWait(driver or self.selenium, timeout).until(
            EC.presence_of_element_located((by, value))
        )

    def click_element(self, by, value, driver = None, timeout=10):
        element = self.find_element(by, value, driver, timeout)
        WebDriverWait(self.selenium, timeout).until(
            EC.element_to_be_clickable((by, value))
        )
        element.click()

    def test_task_list(self):
        Task.objects.create(title="Task Name", description="Task Description")

        self.selenium.get(f"{self.FRONTEND_URL}/tasks/")

        # Buscar a lista de tarefas
        task_list =  self.find_element(By.TAG_NAME, "ul")

        # Verificar se o título da tarefa está presente
        task_title = self.find_element(By.XPATH, ".//li//p[contains(text(),'Task Name')]", task_list)
        self.assertIsNotNone(task_title)

        # Verificar se a descrição da tarefa está presente
        task_description = self.find_element(By.XPATH, ".//li//p[contains(text(),'Task Description')]", task_list)
        self.assertIsNotNone(task_description)

        # Verificar se o botão 'Atualizar' está presente
        update_button = self.find_element(By.XPATH, ".//li//button[contains(text(),'Atualizar')]", task_list)
        self.assertIsNotNone(update_button)

        # Verificar se o botão 'Excluir' está presente
        delete_button = self.find_element(By.XPATH, ".//li//button[contains(text(),'Excluir')]", task_list)
        self.assertIsNotNone(delete_button)

    def test_task_create(self):
        self.selenium.get(f"{self.FRONTEND_URL}/tasks/")

        title_input = self.find_element(By.NAME, "title")
        title_input.send_keys("Task Name")

        description_input = self.find_element(By.NAME, "description")
        description_input.send_keys("Task Description")

        self.click_element(By.XPATH, '//button[text()="Criar"]')
        
        assert Task.objects.count() == 1

    def test_task_delete(self):
        Task.objects.create(title="Task Name", description="Task Description")

        self.selenium.get(f"{self.FRONTEND_URL}/tasks/")

        self.click_element(By.XPATH, "//button[contains(text(),'Excluir')]")

        assert Task.objects.count() == 0

    def test_task_update(self):
        task = Task.objects.create(title="Task Name", description="Task Description")

        self.selenium.get(f"{self.FRONTEND_URL}/tasks/")

        self.click_element(By.XPATH, "//ul//li//button[contains(text(),'Atualizar')]")

        title_input = self.find_element(By.NAME, "title")
        title_input.clear()
        title_input.send_keys("New Task Name")

        description_input = self.find_element(By.NAME, "description")
        description_input.clear()
        description_input.send_keys("New Task Description")

        self.click_element(By.XPATH, '//form//button[text()="Atualizar"]')
        
        task.refresh_from_db()

        assert task.title == "New Task Name"
        assert task.description == "New Task Description"
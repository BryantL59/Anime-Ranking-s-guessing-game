import requests
from bs4 import BeautifulSoup

website = 'https://myanimelist.net/topanime.php'
response = requests.get(website)
content = response.text

soup = BeautifulSoup(content, 'lxml')

table = soup.find('table', class_='top-ranking-table')

for row in table.find_all('tr', class_='ranking-list'):
    rank = row.find('td', class_='rank').get_text(strip=True)
    title = row.find('h3', class_='anime_ranking_h3').get_text(strip=True)
    score = row.find('td', class_='score').get_text(strip=True)
    
    print(f'Rank: {rank}, Title: {title}, Score: {score}')

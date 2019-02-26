import re
#想要提取出{}内容以及四段数字
str = '{"text":"捏捏脸","type":0,"mark":-1}#$%^$%^$%^33480331$%^$%^%^24186721$%^$%^2418672133480331%^&%^&154993997523559692'
#使用(?P<name>expr)提取多个字符串
#使用[]表示待匹配类型、[^]表示不匹配类型
#最后生成一个匹配结果字典
reg = re.compile('^{(?P<data>[^}]*)}[^\d]*(?P<toId>[\d]*)[^\d]*(?P<fromId>[\d]*)[^\d]*(?P<conversationId>[\d]*)[^\d]*(?P<timeStamp>[\d]*)')
regMatch = reg.match(str)

result = regMatch.groupdict()

print(result)
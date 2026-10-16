<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:a="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="utf-8"/>
<xsl:template match="/"><html lang="zh-Hant"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>雀霸傳奇 · RSS</title><link rel="stylesheet" href="https://novel.mahjongx.net/assets/style.css?v=294a0696"/></head>
<body><main class="reader subpage"><h1 class="ch">雀霸傳奇</h1><p class="lead">這是本站的訂閱源（RSS），給閱讀器軟件用的。把這個頁面的網址複製到 Feedly、Inoreader 等閱讀器裡，就能收到新章節提醒。</p>
<ul class="ways"><xsl:for-each select="a:feed/a:entry"><li><a><xsl:attribute name="href"><xsl:value-of select="a:link/@href"/></xsl:attribute><xsl:value-of select="a:title"/></a></li></xsl:for-each></ul>
<p class="center"><a href="https://novel.mahjongx.net/zh-hant/">返回首頁</a></p></main></body></html></xsl:template></xsl:stylesheet>

<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:a="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="utf-8"/>
<xsl:template match="/"><html lang="zh-Hans"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>雀霸传奇 · RSS</title><link rel="stylesheet" href="https://novel.mahjongx.net/assets/style.css?v=294a0696"/></head>
<body><main class="reader subpage"><h1 class="ch">雀霸传奇</h1><p class="lead">这是本站的订阅源（RSS），给阅读器软件用的。把这个页面的网址复制到 Feedly、Inoreader 等阅读器里，就能收到新章节提醒。</p>
<ul class="ways"><xsl:for-each select="a:feed/a:entry"><li><a><xsl:attribute name="href"><xsl:value-of select="a:link/@href"/></xsl:attribute><xsl:value-of select="a:title"/></a></li></xsl:for-each></ul>
<p class="center"><a href="https://novel.mahjongx.net/">返回首页</a></p></main></body></html></xsl:template></xsl:stylesheet>

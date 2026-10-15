<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:a="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="utf-8"/>
<xsl:template match="/"><html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>작도의 전설 · RSS</title><link rel="stylesheet" href="https://novel.mahjongx.net/assets/style.css?v=011944b2"/></head>
<body><main class="reader subpage"><h1 class="ch">작도의 전설</h1><p class="lead">이 페이지는 RSS 리더용 구독 피드입니다. 이 주소를 Feedly, Inoreader 같은 리더에 추가하면 새 장을 자동으로 받아 볼 수 있습니다.</p>
<ul class="ways"><xsl:for-each select="a:feed/a:entry"><li><a><xsl:attribute name="href"><xsl:value-of select="a:link/@href"/></xsl:attribute><xsl:value-of select="a:title"/></a></li></xsl:for-each></ul>
<p class="center"><a href="https://novel.mahjongx.net/ko/">첫 화면으로</a></p></main></body></html></xsl:template></xsl:stylesheet>

<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:a="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="utf-8"/>
<xsl:template match="/"><html lang="ja"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>雀覇伝奇 · RSS</title><link rel="stylesheet" href="https://novel.mahjongx.net/assets/style.css?v=0568969b"/></head>
<body><main class="reader subpage"><h1 class="ch">雀覇伝奇</h1><p class="lead">これは RSS リーダー用の配信フィードです。このページのアドレスを Feedly や Inoreader などに登録すると、新しい章が自動で届きます。</p>
<ul class="ways"><xsl:for-each select="a:feed/a:entry"><li><a><xsl:attribute name="href"><xsl:value-of select="a:link/@href"/></xsl:attribute><xsl:value-of select="a:title"/></a></li></xsl:for-each></ul>
<p class="center"><a href="https://novel.mahjongx.net/ja/">トップページへ</a></p></main></body></html></xsl:template></xsl:stylesheet>

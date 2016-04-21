test.conf works as its name indicates:
	-FileSource = products.xml
		give the path of the input file
	
	-OutputFile = output.xml 
		gives the path where the result of ER stores
	
	-MatcherMerger = serf.data.TestMatcherMerger
		the key ingredient, should be further modified for artists' attriutes comparison
		Besides this matchermerger, functions such as priceMatcher() and titleMatcher() should also be modified to work with our artist, album or other kind of comparsions.

	-PriceThreshold and TitleThreshold
		the threshold to controll whether two object should be treated as the same one accroding to their similarities
	


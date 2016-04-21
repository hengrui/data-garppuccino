package serf.data;

import java.util.Properties;

/**
 * 
 * Use this class to compare Record objects containing yahoo shopping data.
 * Specifically these records should contain the following attributes:
 * 
 * price - the price of the item being sold
 * title - the title of the item being sold
 *
 * Note: this class is similar to YahooMatcherMerger. It works with serialized records of a slightly different format.
 * 
 */
public class TestMatcherMerger extends BasicMatcherMerger implements
		MatcherMerger {

	PriceMatcher priceMatcher;
	TitleMatcher titleMatcher;

	public TestMatcherMerger(Properties props)
	{
		_factory = new SimpleRecordFactory();
		String tt = props.getProperty("TitleThreshold");
		String pt = props.getProperty("PriceThreshold");
		
		float tf = tt == null ? 0.9F : Float.parseFloat(tt);
		float pf = pt == null ? 0.33F : Float.parseFloat(pt);
		
		tf = 0.9F;
		pf = 0.33F;
		
		titleMatcher = new TitleMatcher(tf);
		priceMatcher = new PriceMatcher(pf);
		
	}
	
	protected double calculateConfidence(double c1, double c2)
	{
		return 1.0;
	}
	
	public TestMatcherMerger(RecordFactory factory) 
	{
		_factory = factory;
		titleMatcher = new TitleMatcher(0.9F);
		priceMatcher = new PriceMatcher(0.33F);
	}

	public TestMatcherMerger(RecordFactory factory, float tt, float pt) {
		_factory = factory;
		titleMatcher = new TitleMatcher(tt);
		priceMatcher = new PriceMatcher(pt);
	}
	
	protected boolean matchInternal(Record r1, Record r2)
	{
		
		ExistentialBooleanComparator equals = new ExistentialBooleanComparator(new EqualityMatcher());

		Attribute p1 = r1.getAttribute("price");
		Attribute p2 = r2.getAttribute("price");
		
		if (!ExistentialBooleanComparator.attributesMatch(p1, p2, priceMatcher))
			return false;


		Attribute t1 = r1.getAttribute("title");
		Attribute t2 = r2.getAttribute("title");
		
		return ExistentialBooleanComparator.attributesMatch(t1, t2, titleMatcher);
	}

}

#include <stdio.h>
#include <math.h>
main()
{
	unsigned int c, count, g, next;
	FILE *fp;
	unsigned int n, m, nums[1000000];
	int trials = 0, coprime = 0;
	double rat, pi;
	int v=0,digits;

	printf("How many digits?\n");
	scanf("%d", &digits);

	fp = fopen("pi", "r");
	g = 0; 
	next = 0;
	count = 0;
	while((c = getc(fp)) != EOF){
		if(c < '0' || c > '9')
			continue;
		g = g*10 + (c - '0');
		if(count++ > (digits-2)){
			nums[next++] = g;
			count = g = 0;
		}
	}
	printf("Digits = %d, Samples = %d\n", digits, next);

	while(v < next-2) {
		n = nums[v++];
		m = nums[v++];
		if (m == 0 || n == 0) continue;
		trials++;
		if(fac(n, m) == 1) {
			coprime++;
printf("%d %d coprime\n", n, m);
		} else {
printf("%d %d not coprime (common factor is %d)\n", n, m, fac(n,m));
		}
		if(trials%1000 == 0){
			rat = (double)coprime/trials;
			pi = sqrt(6.0/rat);
			printf("%d of %d coprime, = %f, pi = %f\n", 
				coprime, trials, rat, pi);
		}
	}
}

fac(n, m)
int n, m;
{
	int k;
	if(m > n){
		k = m;
		m = n;
		n = k;
	}
	do {
		k = n%m;
		n = m;
		m = k;
	} while(m > 0);
	return n;
}

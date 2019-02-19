package exercise_bonus;

class A {
	public String show(Object obj) {
		return ""+this.getClass().getSimpleName()+".show("+obj.getClass().getSimpleName()+")";
	}
}

class B extends A {}

class C extends B {}

class D extends C {}


public class Main {
	public static void main(String[] args) {
		A a1 = new A();
		A a2 = new B();
		B b = new B();
		C c = new C();
		D d = new D();
		System.out.println(a1.show(b)); // 1
		System.out.println(a1.show(c)); // 2
		System.out.println(a1.show(d)); // 3
		System.out.println(a2.show(b)); // 4
		System.out.println(((B) a2).show(b)); // 5
		System.out.println(a2.show(c)); // 6
		System.out.println(a2.show(d)); // 7
		System.out.println(b.show(b)); // 8
		System.out.println(b.show(c)); // 9
		System.out.println(b.show(d)); // 10
	}
}

# Local State

Apollo Client는 클라이언트에서 전역 상태를 관리하는 솔루션을 가지고 있다.

-   Apollo Client에서는 클라이언트에서만 사용되는 값을 Local State라고 보고 있다.
-   이름과 다르게 여기서의 Local State는 전역 상태로서 어디에서나 공유되고 변경 가능하다.

전역 상태를 활용하는 방법은 3가지 방식이 있다. (1가지는 deprecated되어 남은 2가지를 살펴보자.)

-   Local-only fields
-   Reactive variable

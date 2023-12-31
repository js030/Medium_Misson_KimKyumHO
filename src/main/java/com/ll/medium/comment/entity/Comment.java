package com.ll.medium.comment.entity;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;

import com.ll.medium.common.entity.DateEntity;
import com.ll.medium.post.entity.Post;
import com.ll.medium.user.entity.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@Getter
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(callSuper = true)
@Entity
public class Comment extends DateEntity {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String content;

    @ManyToOne(fetch = LAZY)
    private User user;

    @ManyToOne(fetch = LAZY)
    private Post post;

    public void update(String content) {
        this.content = content;
    }
}
